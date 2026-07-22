/** Escreve a minuta em disco: Markdown + DOCX, num diretório de saída. */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Minuta } from "../types.ts";
import { minutaParaMarkdown } from "./markdown.ts";
import { minutaParaDocxBuffer } from "./docx.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const OUTPUT_PADRAO = resolve(__dirname, "../../output");

/** Slug de arquivo a partir do título. */
export function slug(s: string): string {
  return (
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "projeto"
  );
}

export interface ArquivosGerados {
  markdown: string;
  docx: string;
}

export function exportarMinuta(
  m: Minuta,
  dirSaida = OUTPUT_PADRAO
): ArquivosGerados {
  mkdirSync(dirSaida, { recursive: true });
  const base = `${m.lei}-${slug(m.briefing.titulo)}`;
  const mdPath = resolve(dirSaida, `${base}.md`);
  const docxPath = resolve(dirSaida, `${base}.docx`);
  writeFileSync(mdPath, minutaParaMarkdown(m), "utf8");
  writeFileSync(docxPath, minutaParaDocxBuffer(m));
  return { markdown: mdPath, docx: docxPath };
}

export { minutaParaMarkdown, minutaParaDocxBuffer };
