/**
 * Coletor de projetos aprovados da Lei de Incentivo ao Esporte (LIE).
 *
 * IMPORTANTE: diferentemente do SALIC, a LIE **não** dispõe de API pública consolidada.
 * As listas de projetos aprovados são publicadas em portarias no DOU e em planilhas no
 * portal do Ministério do Esporte (gov.br/esporte). O portal é uma SPA/JS que dificulta
 * scraping automatizado direto.
 *
 * Estratégia (documentada em docs/normativos/esporte/00-RESUMO-NORMATIVO.md §5):
 *  - Importar planilhas oficiais (CSV/XLSX exportado, ou colado como CSV) baixadas do portal.
 *  - Este módulo importa um CSV com colunas mapeáveis para o schema comum.
 *
 * Assim evitamos inventar dados: a fonte é sempre a planilha/portaria oficial baixada
 * manualmente para captacao/data/esporte/.
 */
import type { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { upsertProjeto } from "../db/db.ts";
import type { ProjetoReferencia } from "../types.ts";
import { parseCsv } from "./csv.ts";

export { parseCsv };

/** Mapa flexível de nomes de coluna → campo do schema. Aceita variações comuns. */
const ALIASES: Record<keyof ProjetoReferencia, string[]> = {
  identificador: [
    "processo",
    "nº processo",
    "numero",
    "n_processo",
    "proposta",
    "id",
  ],
  titulo: ["titulo", "título", "nome do projeto", "projeto", "nome"],
  area: ["manifestacao", "manifestação", "nivel", "nível", "modalidade"],
  proponente: ["proponente", "entidade", "instituicao", "instituição"],
  cgccpf: ["cnpj", "cpf", "cgccpf"],
  uf: ["uf", "estado"],
  municipio: ["municipio", "município", "cidade"],
  valor_solicitado: ["valor solicitado", "valor_solicitado", "solicitado"],
  valor_aprovado: [
    "valor aprovado",
    "valor_aprovado",
    "aprovado",
    "valor autorizado",
  ],
  valor_captado: ["valor captado", "valor_captado", "captado"],
  ano: ["ano", "exercicio", "exercício"],
  situacao: ["situacao", "situação", "status"],
  resumo: ["resumo", "objeto", "descricao", "descrição"],
  objetivos: ["objetivos", "objetivo"],
  justificativa: ["justificativa"],
  acessibilidade: ["acessibilidade"],
  democratizacao: ["democratizacao", "democratização"],
  ficha_tecnica: ["ficha tecnica", "ficha técnica", "equipe"],
  etapas: ["etapas", "cronograma"],
  // campos derivados/fixos:
  lei: [],
  texto_completo: [],
  fonte_url: [],
  coletado_em: [],
  id: [],
};

function normaliza(s: string): string {
  return s.trim().toLowerCase();
}

function brl(v: string | undefined): number | null {
  if (!v) return null;
  const n = Number(
    v
      .replace(/[^\d,.-]/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
  );
  return Number.isFinite(n) ? n : null;
}

/**
 * Importa um CSV de projetos aprovados da LIE.
 * @param fonteUrl URL da portaria/planilha oficial de origem (para rastreabilidade).
 */
export function importarCsvEsporte(
  db: DatabaseSync,
  caminhoCsv: string,
  fonteUrl: string,
  sep = ","
): number {
  const texto = readFileSync(caminhoCsv, "utf8");
  const linhas = parseCsv(texto, sep);
  if (linhas.length < 2) return 0;
  const header = linhas[0].map(normaliza);

  // resolve índice de coluna para cada campo
  const idx: Partial<Record<keyof ProjetoReferencia, number>> = {};
  for (const campo of Object.keys(ALIASES) as (keyof ProjetoReferencia)[]) {
    for (const alias of ALIASES[campo]) {
      const i = header.indexOf(alias);
      if (i >= 0) {
        idx[campo] = i;
        break;
      }
    }
  }

  let gravados = 0;
  for (const l of linhas.slice(1)) {
    const get = (c: keyof ProjetoReferencia): string | undefined =>
      idx[c] != null ? l[idx[c]!] : undefined;

    const identificador = (get("identificador") ?? get("titulo") ?? "").trim();
    if (!identificador) continue;

    const resumo = get("resumo") ?? null;
    const proj: ProjetoReferencia = {
      lei: "esporte",
      identificador,
      area: get("area") ?? null,
      titulo: (get("titulo") ?? identificador).trim(),
      proponente: get("proponente") ?? null,
      cgccpf: get("cgccpf") ?? null,
      uf: get("uf") ?? null,
      municipio: get("municipio") ?? null,
      valor_solicitado: brl(get("valor_solicitado")),
      valor_aprovado: brl(get("valor_aprovado")),
      valor_captado: brl(get("valor_captado")),
      ano: get("ano") ? Number(get("ano")) || null : null,
      situacao: get("situacao") ?? null,
      resumo,
      objetivos: get("objetivos") ?? null,
      justificativa: get("justificativa") ?? null,
      acessibilidade: get("acessibilidade") ?? null,
      democratizacao: get("democratizacao") ?? null,
      ficha_tecnica: get("ficha_tecnica") ?? null,
      etapas: get("etapas") ?? null,
      texto_completo:
        [resumo, get("objetivos"), get("justificativa")]
          .filter(Boolean)
          .join("\n\n") || null,
      fonte_url: fonteUrl,
      coletado_em: new Date().toISOString(),
    };
    gravados += upsertProjeto(db, proj);
  }
  return gravados;
}
