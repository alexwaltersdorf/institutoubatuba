/** Exportação da minuta para Markdown, incluindo relatório de validação e checklist. */
import type { Minuta, Pendencia } from "../types.ts";
import { reais } from "../templates/comum.ts";

const ICONE: Record<Pendencia["severidade"], string> = {
  erro: "❌",
  alerta: "⚠️",
  verificar: "🔎",
  ok: "✅",
};

const NOME_LEI = {
  esporte: "Lei de Incentivo ao Esporte (LIE / SLI + SEI)",
  cultura: "Lei de Incentivo à Cultura (Rouanet / SALIC)",
};

export function minutaParaMarkdown(m: Minuta): string {
  const b = m.briefing;
  const l: string[] = [];
  l.push(`# ${b.titulo}`);
  l.push("");
  l.push(`> **Plataforma:** ${NOME_LEI[m.lei]}`);
  l.push(
    `> **Área/nível:** ${b.area} · **Local:** ${b.cidade} · **Valor estimado:** ${reais(b.valorEstimado)}`
  );
  l.push(`> **Gerado em:** ${m.geradoEm}`);
  l.push(`>`);
  l.push(
    `> ⚠️ **Minuta de trabalho.** Textos entre «...» exigem preenchimento pelo proponente. Itens [VERIFICAR] dependem de confirmação em fonte oficial (ver docs/normativos/).`
  );
  l.push("");

  // Relatório de conformidade primeiro (o que precisa de ação)
  l.push("## Relatório de conformidade");
  l.push("");
  l.push(
    `**Situação:** ${m.validacao.conforme ? "✅ Sem erros bloqueantes" : "❌ Há pendências que impedem o cadastro"}`
  );
  l.push("");
  if (m.validacao.pendencias.length === 0) {
    l.push("_Nenhuma pendência detectada._");
  } else {
    l.push("| | Campo | Pendência | Fonte |");
    l.push("|---|---|---|---|");
    for (const p of m.validacao.pendencias) {
      l.push(
        `| ${ICONE[p.severidade]} | ${p.campo} | ${p.mensagem} | ${p.fonte ?? "-"} |`
      );
    }
  }
  l.push("");

  // Seções da minuta
  for (const s of m.secoes) {
    l.push(`## ${s.titulo}`);
    if (s.campoPlataforma) l.push(`*Onde cadastrar:* \`${s.campoPlataforma}\``);
    l.push("");
    l.push(s.conteudo);
    l.push("");
  }

  // Checklist de cadastro
  l.push("## Checklist de cadastro (passo a passo)");
  l.push("");
  m.checklist.forEach((passo, i) => l.push(`${i + 1}. ${passo}`));
  l.push("");

  return l.join("\n");
}
