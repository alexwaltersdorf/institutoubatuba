#!/usr/bin/env -S node --experimental-sqlite
/**
 * CLI do sistema de elaboração de projetos de captação (LIE + Rouanet/SALIC).
 *
 * Comandos:
 *   init                         Cria/abre a base local.
 *   collect [--areas 2,3] [...]  Coleta projetos aprovados do SALIC (VerSALIC).
 *   import-esporte <csv> <url>   Importa CSV de projetos aprovados da LIE.
 *   stats                        Mostra estatísticas da base.
 *   search <termos> [--lei] [--area]  Busca na base.
 *   generate <arquivo.json>      Gera minuta a partir de um briefing JSON.
 *   generate --lei ... --titulo ... (flags)  Gera minuta a partir de flags.
 *
 * Execução (via package.json): `pnpm cap <comando>` ou
 *   node --experimental-sqlite --import tsx captacao/src/cli.ts <comando>
 */
import { readFileSync } from "node:fs";
import { abrirBanco, contarProjetos, estatisticas } from "./db/db.ts";
import { coletarSalic } from "./collect/versalic.ts";
import { importarCsvEsporte } from "./collect/esporte.ts";
import { buscarReferencias } from "./search/search.ts";
import { gerarProjeto } from "./generate/generate.ts";
import { exportarMinuta } from "./export/index.ts";
import type { BriefingProjeto, Lei } from "./types.ts";
import { reais } from "./templates/comum.ts";

type Flags = Record<string, string | boolean>;

function parseArgs(argv: string[]): {
  cmd: string;
  pos: string[];
  flags: Flags;
} {
  const [cmd = "help", ...rest] = argv;
  const pos: string[] = [];
  const flags: Flags = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a.startsWith("--")) {
      const chave = a.slice(2);
      const prox = rest[i + 1];
      if (prox && !prox.startsWith("--")) {
        flags[chave] = prox;
        i++;
      } else flags[chave] = true;
    } else pos.push(a);
  }
  return { cmd, pos, flags };
}

async function main() {
  const { cmd, pos, flags } = parseArgs(process.argv.slice(2));
  const db = abrirBanco();

  switch (cmd) {
    case "init": {
      console.log(`Base inicializada. Projetos atuais: ${contarProjetos(db)}`);
      break;
    }

    case "collect": {
      const areas = String(flags.areas ?? "2,3,6")
        .split(",")
        .map(s => s.trim());
      const porArea = Number(flags["por-area"] ?? 100);
      const detalhar = Boolean(flags.detalhar);
      console.log(
        `Coletando SALIC — áreas ${areas.join(", ")}, até ${porArea}/área, detalhar=${detalhar}`
      );
      const n = await coletarSalic(db, {
        areas,
        porArea,
        detalhar,
        filtroSituacao: flags.situacao ? String(flags.situacao) : undefined,
        log: m => console.log(m),
      });
      console.log(
        `\n✅ ${n} novos projetos gravados. Total na base: ${contarProjetos(db, "cultura")} (cultura).`
      );
      break;
    }

    case "import-esporte": {
      const [csv, url] = pos;
      if (!csv || !url) {
        console.error(
          "Uso: import-esporte <arquivo.csv> <url-da-fonte> [--sep ;]"
        );
        process.exit(1);
      }
      const sep = flags.sep ? String(flags.sep) : ",";
      const n = importarCsvEsporte(db, csv, url, sep);
      console.log(
        `✅ ${n} novos projetos de esporte importados. Total: ${contarProjetos(db, "esporte")}.`
      );
      break;
    }

    case "stats": {
      console.log(`Total de projetos: ${contarProjetos(db)}`);
      for (const r of estatisticas(db)) {
        console.log(
          `  ${r.lei.padEnd(8)} | ${(r.area ?? "(sem área)").padEnd(28)} | ${r.n}`
        );
      }
      break;
    }

    case "search": {
      const termos = pos;
      const res = buscarReferencias(db, {
        lei: flags.lei as Lei | undefined,
        area: flags.area ? String(flags.area) : undefined,
        termos,
        valorMin: flags.min ? Number(flags.min) : undefined,
        valorMax: flags.max ? Number(flags.max) : undefined,
        limite: flags.n ? Number(flags.n) : 10,
      });
      console.log(`${res.length} resultado(s):\n`);
      for (const p of res) {
        console.log(
          `• [${p.lei}/${p.area ?? "?"}] ${p.titulo} (${p.identificador})`
        );
        if (p.valor_aprovado != null)
          console.log(
            `    aprovado: ${reais(p.valor_aprovado)}${p.proponente ? " — " + p.proponente : ""}`
          );
      }
      break;
    }

    case "generate": {
      let briefing: BriefingProjeto;
      if (pos[0]) {
        briefing = JSON.parse(readFileSync(pos[0], "utf8"));
      } else {
        if (!flags.lei || !flags.titulo || !flags.area) {
          console.error(
            "Uso: generate <briefing.json>  OU  generate --lei esporte|cultura --titulo ... --area ... --resumo ... --publico ... --cidade ... --valor 200000"
          );
          process.exit(1);
        }
        briefing = {
          lei: flags.lei as Lei,
          titulo: String(flags.titulo),
          area: String(flags.area),
          resumo: String(flags.resumo ?? ""),
          publico: String(flags.publico ?? ""),
          cidade: String(flags.cidade ?? "Ubatuba/SP"),
          valorEstimado: Number(flags.valor ?? 0),
          nRefs: flags.refs ? Number(flags.refs) : undefined,
        };
      }
      const minuta = gerarProjeto(db, briefing);
      const arqs = exportarMinuta(minuta);
      const erros = minuta.validacao.pendencias.filter(
        p => p.severidade === "erro"
      ).length;
      const alertas = minuta.validacao.pendencias.filter(
        p => p.severidade !== "erro"
      ).length;
      console.log(
        `✅ Minuta gerada (${minuta.referencias.length} referências).`
      );
      console.log(`   Markdown: ${arqs.markdown}`);
      console.log(`   DOCX:     ${arqs.docx}`);
      console.log(
        `   Conformidade: ${erros} erro(s), ${alertas} alerta(s)/verificar.`
      );
      if (erros)
        console.log(
          `   ⚠️  Resolva os erros antes de cadastrar (ver relatório na minuta).`
        );
      break;
    }

    default:
      console.log(`Sistema de Elaboração de Projetos de Captação (LIE + Rouanet/SALIC)

Comandos:
  init                          Inicializa a base local (SQLite)
  collect [--areas 2,3,6] [--por-area 100] [--detalhar] [--situacao Autorizada]
                                Coleta projetos aprovados do SALIC (VerSALIC API)
  import-esporte <csv> <url> [--sep ;]
                                Importa CSV de projetos aprovados da LIE
  stats                         Estatísticas da base
  search <termos> [--lei] [--area] [--min] [--max] [--n]
                                Busca projetos de referência
  generate <briefing.json>      Gera minuta (Markdown + DOCX)
  generate --lei ... --titulo ... --area ... --resumo ... --publico ... --cidade ... --valor ...

Docs normativas: docs/normativos/  ·  Arquitetura: CLAUDE.md`);
  }
}

main().catch(e => {
  console.error("Erro:", e);
  process.exit(1);
});
