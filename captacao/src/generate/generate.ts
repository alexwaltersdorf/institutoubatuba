/**
 * Fluxo de geração de projeto (Fase 4).
 * Recupera referências da base → gera minuta no template correto → valida → devolve Minuta.
 */
import type { DatabaseSync } from "node:sqlite";
import type { BriefingProjeto, Minuta } from "../types.ts";
import { referenciasSimilares } from "../search/search.ts";
import { gerarMinutaEsporte } from "../templates/esporte.ts";
import { gerarMinutaCultura } from "../templates/cultura.ts";

export function gerarProjeto(
  db: DatabaseSync,
  briefing: BriefingProjeto
): Minuta {
  const refs = referenciasSimilares(db, {
    lei: briefing.lei,
    area: briefing.area,
    resumo: briefing.resumo,
    valorEstimado: briefing.valorEstimado,
    n: briefing.nRefs ?? 4,
  });
  return briefing.lei === "esporte"
    ? gerarMinutaEsporte(briefing, refs)
    : gerarMinutaCultura(briefing, refs);
}
