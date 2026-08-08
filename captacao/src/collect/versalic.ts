/**
 * Coletor de projetos aprovados do SALIC via API pública VerSALIC.
 *
 * Base confirmada (18/07/2026): https://api.salic.cultura.gov.br/api/v1/
 * Paginação HAL: resposta traz `_embedded`, `_links`, `count`, `total`.
 * Docs: https://api.salic.cultura.gov.br/docs
 *
 * Coleta respeitosa: rate limit entre chamadas + retry com backoff.
 */
import type { DatabaseSync } from "node:sqlite";
import { upsertProjeto } from "../db/db.ts";
import type { ProjetoReferencia } from "../types.ts";
import { AREAS_CULTURA } from "../rules/cultura.ts";

const BASE = "https://api.salic.cultura.gov.br/api/v1";
const UA =
  "InstitutoUbatuba-Captacao/1.0 (pesquisa de projetos aprovados; contato via institutoubatuba)";

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function getJson(url: string, tentativas = 4): Promise<any> {
  let ultimoErro: unknown;
  for (let i = 0; i < tentativas; i++) {
    try {
      const resp = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json" },
      });
      if (resp.status === 429 || resp.status >= 500) {
        throw new Error(`HTTP ${resp.status}`);
      }
      if (!resp.ok) throw new Error(`HTTP ${resp.status} em ${url}`);
      return await resp.json();
    } catch (e) {
      ultimoErro = e;
      const espera = Math.min(2000 * 2 ** i, 16000);
      await sleep(espera);
    }
  }
  throw new Error(`Falha ao buscar ${url}: ${String(ultimoErro)}`);
}

/** Extrai o array de itens de uma resposta HAL, seja qual for a chave em _embedded. */
function itensHal(resp: any): any[] {
  const emb = resp?._embedded;
  if (!emb) return [];
  const chave = Object.keys(emb)[0];
  return Array.isArray(emb[chave]) ? emb[chave] : [];
}

function anoDe(raw: any): number | null {
  const s = String(
    raw?.data_inicio_execucao ?? raw?.data_inicio ?? raw?.PRONAC ?? ""
  );
  const m = s.match(/(20\d{2}|19\d{2})/);
  if (m) return Number(m[1]);
  // PRONAC costuma começar com AA (ano) — ex.: "265233" → 2026? não confiável; deixamos null.
  return null;
}

function num(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n =
    typeof v === "number" ? v : Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Mapeia um projeto bruto da API para o schema comum, incluindo sub-recursos já embutidos. */
export function mapearProjetoSalic(raw: any): ProjetoReferencia {
  const areaCod = String(raw.area ?? raw.codigo_area ?? "").trim();
  const areaNome = AREAS_CULTURA[areaCod] ?? raw.area ?? null;
  const partes = [
    raw.resumo,
    raw.sinopse,
    raw.objetivos,
    raw.justificativa,
    raw.acessibilidade,
    raw.democratizacao,
    raw.ficha_tecnica,
    raw.etapa,
  ].filter(Boolean);
  return {
    lei: "cultura",
    identificador: String(raw.PRONAC ?? raw.pronac ?? "").trim(),
    area: areaNome,
    titulo: raw.nome ?? raw.nome_projeto ?? "(sem título)",
    proponente: raw.proponente ?? raw.nome_proponente ?? null,
    cgccpf: raw.cgccpf ?? null,
    uf: raw.UF ?? raw.uf ?? null,
    municipio: raw.municipio ?? null,
    valor_solicitado: num(raw.valor_solicitado),
    valor_aprovado: num(raw.valor_aprovado ?? raw.valor_projeto),
    valor_captado: num(raw.valor_captado),
    ano: anoDe(raw),
    situacao: raw.situacao ?? null,
    resumo: raw.resumo ?? null,
    objetivos: raw.objetivos ?? null,
    justificativa: raw.justificativa ?? null,
    acessibilidade: raw.acessibilidade ?? null,
    democratizacao: raw.democratizacao ?? null,
    ficha_tecnica: raw.ficha_tecnica ?? null,
    etapas: raw.etapa ?? null,
    texto_completo: partes.join("\n\n") || null,
    fonte_url: `${BASE}/projetos/${raw.PRONAC ?? ""}`,
    coletado_em: new Date().toISOString(),
  };
}

export interface OpcoesColeta {
  /** Códigos de área a coletar (ver AREAS_CULTURA). Default: educação/audiovisual afins. */
  areas?: string[];
  /** Máximo de projetos por área. Default 200. */
  porArea?: number;
  /** Tamanho de página (1..100). Default 100. */
  pageSize?: number;
  /** Só situações que contenham este termo (ex.: "Autorizada"/"aprovad"). */
  filtroSituacao?: string;
  /** Buscar sub-recursos (objetivos, justificativa...) de cada projeto. Mais lento. */
  detalhar?: boolean;
  /** Delay entre chamadas em ms (coleta respeitosa). Default 500. */
  delayMs?: number;
  log?: (msg: string) => void;
}

/** Coleta projetos aprovados e grava na base. Retorna nº de projetos gravados. */
export async function coletarSalic(
  db: DatabaseSync,
  opts: OpcoesColeta = {}
): Promise<number> {
  const areas = opts.areas ?? ["2"]; // audiovisual por padrão (educativo)
  const porArea = opts.porArea ?? 200;
  const pageSize = Math.min(opts.pageSize ?? 100, 100);
  const delay = opts.delayMs ?? 500;
  const log = opts.log ?? (() => {});
  let gravados = 0;

  for (const area of areas) {
    const nomeArea = AREAS_CULTURA[area] ?? area;
    log(`\n[SALIC] Área ${area} (${nomeArea}) — meta ${porArea} projetos`);
    let offset = 0;
    let coletadosArea = 0;

    while (coletadosArea < porArea) {
      const limit = Math.min(pageSize, porArea - coletadosArea);
      const url = `${BASE}/projetos?area=${encodeURIComponent(area)}&limit=${limit}&offset=${offset}`;
      const resp = await getJson(url);
      const itens = itensHal(resp);
      if (itens.length === 0) break;

      for (const raw of itens) {
        if (opts.filtroSituacao) {
          const sit = String(raw.situacao ?? "").toLowerCase();
          if (!sit.includes(opts.filtroSituacao.toLowerCase())) continue;
        }
        let proj = mapearProjetoSalic(raw);
        // O endpoint de lista por área nem sempre ecoa o campo `area` em cada projeto;
        // como coletamos por código de área, preenchemos com o nome conhecido.
        if (!proj.area) proj.area = nomeArea;
        if (opts.detalhar && proj.identificador) {
          proj = await detalharProjeto(proj, delay);
        }
        if (!proj.identificador) continue;
        gravados += upsertProjeto(db, proj);
        coletadosArea++;
      }
      offset += itens.length;
      log(`  offset=${offset} coletados=${coletadosArea}/${porArea}`);
      await sleep(delay);
      if (itens.length < limit) break; // acabaram os projetos da área
    }
  }
  return gravados;
}

/** Enriquece um projeto com sub-recursos textuais (objetivos, justificativa, etc.). */
async function detalharProjeto(
  proj: ProjetoReferencia,
  delay: number
): Promise<ProjetoReferencia> {
  const sub = async (nome: string): Promise<string | null> => {
    try {
      const r = await getJson(`${BASE}/projetos/${proj.identificador}/${nome}`);
      const itens = itensHal(r);
      const txt = itens
        .map(i =>
          Object.values(i)
            .filter(v => typeof v === "string")
            .join(" ")
        )
        .join("\n");
      return txt || null;
    } catch {
      return null;
    } finally {
      await sleep(delay);
    }
  };
  proj.objetivos ??= await sub("objetivos");
  proj.justificativa ??= await sub("justificativa");
  proj.acessibilidade ??= await sub("acessibilidade");
  proj.democratizacao ??= await sub("democratizacao");
  proj.etapas ??= await sub("etapa");
  proj.texto_completo =
    [
      proj.resumo,
      proj.objetivos,
      proj.justificativa,
      proj.acessibilidade,
      proj.democratizacao,
      proj.ficha_tecnica,
      proj.etapas,
    ]
      .filter(Boolean)
      .join("\n\n") || proj.texto_completo;
  return proj;
}
