/**
 * Camada de acesso à base local de projetos de referência.
 * Usa o SQLite embutido do Node (node:sqlite) — nenhuma dependência nativa.
 * Requer execução com a flag `--experimental-sqlite` (ver scripts em package.json).
 */
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ProjetoReferencia } from "../types.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** Caminho padrão do banco: captacao/data/referencia.sqlite (ignorado pelo git). */
export const DB_PATH_PADRAO = resolve(
  __dirname,
  "../../data/referencia.sqlite"
);

const SCHEMA = `
CREATE TABLE IF NOT EXISTS projetos_referencia (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  lei            TEXT NOT NULL,
  identificador  TEXT NOT NULL,
  area           TEXT,
  titulo         TEXT NOT NULL,
  proponente     TEXT,
  cgccpf         TEXT,
  uf             TEXT,
  municipio      TEXT,
  valor_solicitado REAL,
  valor_aprovado   REAL,
  valor_captado    REAL,
  ano            INTEGER,
  situacao       TEXT,
  resumo         TEXT,
  objetivos      TEXT,
  justificativa  TEXT,
  acessibilidade TEXT,
  democratizacao TEXT,
  ficha_tecnica  TEXT,
  etapas         TEXT,
  texto_completo TEXT,
  fonte_url      TEXT,
  coletado_em    TEXT,
  UNIQUE(lei, identificador)
);
CREATE INDEX IF NOT EXISTS idx_ref_lei_area ON projetos_referencia(lei, area);
CREATE INDEX IF NOT EXISTS idx_ref_valor   ON projetos_referencia(valor_aprovado);
`;

export function abrirBanco(caminho: string = DB_PATH_PADRAO): DatabaseSync {
  mkdirSync(dirname(caminho), { recursive: true });
  const db = new DatabaseSync(caminho);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec(SCHEMA);
  return db;
}

/** Insere ou atualiza (upsert por lei+identificador). Retorna 1 se novo, 0 se atualizado. */
export function upsertProjeto(db: DatabaseSync, p: ProjetoReferencia): number {
  const existe = db
    .prepare(
      "SELECT id FROM projetos_referencia WHERE lei = ? AND identificador = ?"
    )
    .get(p.lei, p.identificador) as { id: number } | undefined;

  const cols = [
    "lei",
    "identificador",
    "area",
    "titulo",
    "proponente",
    "cgccpf",
    "uf",
    "municipio",
    "valor_solicitado",
    "valor_aprovado",
    "valor_captado",
    "ano",
    "situacao",
    "resumo",
    "objetivos",
    "justificativa",
    "acessibilidade",
    "democratizacao",
    "ficha_tecnica",
    "etapas",
    "texto_completo",
    "fonte_url",
    "coletado_em",
  ] as const;

  const valores = cols.map(
    c => (p as unknown as Record<string, unknown>)[c] ?? null
  );

  if (existe) {
    const setClause = cols.map(c => `${c} = ?`).join(", ");
    db.prepare(`UPDATE projetos_referencia SET ${setClause} WHERE id = ?`).run(
      ...(valores as (string | number | null)[]),
      existe.id
    );
    return 0;
  }
  const placeholders = cols.map(() => "?").join(", ");
  db.prepare(
    `INSERT INTO projetos_referencia (${cols.join(", ")}) VALUES (${placeholders})`
  ).run(...(valores as (string | number | null)[]));
  return 1;
}

export function contarProjetos(db: DatabaseSync, lei?: string): number {
  const row = lei
    ? (db
        .prepare("SELECT COUNT(*) c FROM projetos_referencia WHERE lei = ?")
        .get(lei) as { c: number })
    : (db.prepare("SELECT COUNT(*) c FROM projetos_referencia").get() as {
        c: number;
      });
  return row.c;
}

export function estatisticas(
  db: DatabaseSync
): Array<{ lei: string; area: string | null; n: number }> {
  return db
    .prepare(
      "SELECT lei, area, COUNT(*) n FROM projetos_referencia GROUP BY lei, area ORDER BY lei, n DESC"
    )
    .all() as Array<{ lei: string; area: string | null; n: number }>;
}
