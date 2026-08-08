/**
 * Busca sobre a base de projetos de referência.
 * Busca por palavra-chave (LIKE, sem depender de FTS5) + filtros por área e faixa de valor,
 * com pontuação de relevância simples em JS.
 */
import type { DatabaseSync } from "node:sqlite";
import type { Lei, ProjetoReferencia } from "../types.ts";

export interface FiltrosBusca {
  lei?: Lei;
  area?: string; // substring, case-insensitive
  valorMin?: number;
  valorMax?: number;
  termos?: string[]; // palavras-chave
  limite?: number; // default 5
}

const CAMPOS_TEXTO: (keyof ProjetoReferencia)[] = [
  "titulo",
  "resumo",
  "objetivos",
  "justificativa",
  "area",
  "texto_completo",
];

/** Pontua um projeto pela ocorrência dos termos nos campos textuais. */
function pontuar(p: ProjetoReferencia, termos: string[]): number {
  if (termos.length === 0) return 1;
  let score = 0;
  for (const campo of CAMPOS_TEXTO) {
    const v = String(
      (p as unknown as Record<string, unknown>)[campo] ?? ""
    ).toLowerCase();
    if (!v) continue;
    const peso = campo === "titulo" ? 3 : campo === "resumo" ? 2 : 1;
    for (const t of termos) {
      if (!t) continue;
      const idx = v.indexOf(t.toLowerCase());
      if (idx >= 0) score += peso;
    }
  }
  return score;
}

export function buscarReferencias(
  db: DatabaseSync,
  f: FiltrosBusca
): ProjetoReferencia[] {
  const cond: string[] = [];
  const args: (string | number)[] = [];
  if (f.lei) {
    cond.push("lei = ?");
    args.push(f.lei);
  }
  if (f.area) {
    cond.push("LOWER(area) LIKE ?");
    args.push(`%${f.area.toLowerCase()}%`);
  }
  if (f.valorMin != null) {
    cond.push("valor_aprovado >= ?");
    args.push(f.valorMin);
  }
  if (f.valorMax != null) {
    cond.push("valor_aprovado <= ?");
    args.push(f.valorMax);
  }

  const where = cond.length ? `WHERE ${cond.join(" AND ")}` : "";
  const linhas = db
    .prepare(`SELECT * FROM projetos_referencia ${where}`)
    .all(...args) as unknown as ProjetoReferencia[];

  const termos = (f.termos ?? []).filter(Boolean);
  const comScore = linhas
    .map(p => ({ p, s: pontuar(p, termos) }))
    .filter(x => (termos.length ? x.s > 0 : true))
    .sort(
      (a, b) =>
        b.s - a.s || (b.p.valor_aprovado ?? 0) - (a.p.valor_aprovado ?? 0)
    );

  return comScore.slice(0, f.limite ?? 5).map(x => x.p);
}

/** Recupera 3–5 projetos aprovados similares para servir de referência à elaboração. */
export function referenciasSimilares(
  db: DatabaseSync,
  params: {
    lei: Lei;
    area: string;
    resumo: string;
    valorEstimado: number;
    n?: number;
  }
): ProjetoReferencia[] {
  const n = params.n ?? 4;
  // termos: palavras relevantes do resumo (> 3 letras)
  const termos = params.resumo
    .split(/\W+/)
    .filter(t => t.length > 3)
    .slice(0, 12);
  // faixa de valor: 40%–250% do estimado (referência de orçamento comparável)
  const valorMin = params.valorEstimado * 0.4;
  const valorMax = params.valorEstimado * 2.5;

  // 1ª tentativa: área + termos + faixa de valor
  let res = buscarReferencias(db, {
    lei: params.lei,
    area: params.area,
    termos,
    valorMin,
    valorMax,
    limite: n,
  });
  // fallback: relaxa faixa de valor
  if (res.length < n) {
    res = dedup(
      res,
      buscarReferencias(db, {
        lei: params.lei,
        area: params.area,
        termos,
        limite: n,
      })
    );
  }
  // fallback: relaxa área
  if (res.length < n) {
    res = dedup(
      res,
      buscarReferencias(db, { lei: params.lei, termos, limite: n })
    );
  }
  // fallback final: qualquer projeto da lei
  if (res.length < n) {
    res = dedup(res, buscarReferencias(db, { lei: params.lei, limite: n }));
  }
  return res.slice(0, n);
}

function dedup(
  a: ProjetoReferencia[],
  b: ProjetoReferencia[]
): ProjetoReferencia[] {
  const vistos = new Set(a.map(p => p.identificador));
  const out = [...a];
  for (const p of b) {
    if (!vistos.has(p.identificador)) {
      vistos.add(p.identificador);
      out.push(p);
    }
  }
  return out;
}
