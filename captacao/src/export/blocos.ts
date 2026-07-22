/**
 * Converte uma Minuta num modelo de blocos neutro (usado pelo gerador de DOCX).
 * Faz um parse leve do conteúdo markdown de cada seção: tabelas "| a | b |",
 * listas "- item" e parágrafos.
 */
import type { Minuta } from "../types.ts";
import { reais } from "../templates/comum.ts";

export type Bloco =
  | { tipo: "titulo"; nivel: number; texto: string }
  | { tipo: "paragrafo"; texto: string }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "tabela"; linhas: string[][]; temCabecalho: boolean };

const NOME_LEI = {
  esporte: "Lei de Incentivo ao Esporte (LIE / SLI + SEI)",
  cultura: "Lei de Incentivo à Cultura (Rouanet / SALIC)",
};

function ehSeparadorTabela(linha: string): boolean {
  return /^\s*\|?[\s:|-]+\|?\s*$/.test(linha) && linha.includes("-");
}

function celulasDe(linha: string): string[] {
  let s = linha.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map(c => c.trim());
}

/** Parseia um trecho markdown em blocos. */
export function parseConteudo(md: string): Bloco[] {
  const linhas = md.split("\n");
  const blocos: Bloco[] = [];
  let i = 0;
  let paraBuf: string[] = [];
  let listaBuf: string[] = [];

  const flushPara = () => {
    if (paraBuf.length) {
      blocos.push({ tipo: "paragrafo", texto: paraBuf.join(" ") });
      paraBuf = [];
    }
  };
  const flushLista = () => {
    if (listaBuf.length) {
      blocos.push({ tipo: "lista", itens: listaBuf.slice() });
      listaBuf = [];
    }
  };

  while (i < linhas.length) {
    const linha = linhas[i];
    const t = linha.trim();

    // tabela
    if (
      t.startsWith("|") &&
      i + 1 < linhas.length &&
      ehSeparadorTabela(linhas[i + 1])
    ) {
      flushPara();
      flushLista();
      const linhasTab: string[][] = [celulasDe(linha)];
      i += 2; // pula cabeçalho + separador
      while (i < linhas.length && linhas[i].trim().startsWith("|")) {
        linhasTab.push(celulasDe(linhas[i]));
        i++;
      }
      blocos.push({ tipo: "tabela", linhas: linhasTab, temCabecalho: true });
      continue;
    }

    // lista
    if (/^[-*]\s+/.test(t)) {
      flushPara();
      listaBuf.push(t.replace(/^[-*]\s+/, ""));
      i++;
      continue;
    }

    // linha em branco
    if (t === "") {
      flushPara();
      flushLista();
      i++;
      continue;
    }

    flushLista();
    // remove citação/itálico marcador simples
    paraBuf.push(t.replace(/^>\s?/, ""));
    i++;
  }
  flushPara();
  flushLista();
  return blocos;
}

export function minutaParaBlocos(m: Minuta): Bloco[] {
  const b = m.briefing;
  const out: Bloco[] = [];
  out.push({ tipo: "titulo", nivel: 0, texto: b.titulo });
  out.push({ tipo: "paragrafo", texto: `**Plataforma:** ${NOME_LEI[m.lei]}` });
  out.push({
    tipo: "paragrafo",
    texto: `**Área/nível:** ${b.area} · **Local:** ${b.cidade} · **Valor estimado:** ${reais(b.valorEstimado)}`,
  });
  out.push({
    tipo: "paragrafo",
    texto:
      "Minuta de trabalho. Textos entre «...» exigem preenchimento; itens [VERIFICAR] dependem de confirmação em fonte oficial.",
  });

  // Conformidade
  out.push({ tipo: "titulo", nivel: 1, texto: "Relatório de conformidade" });
  out.push({
    tipo: "paragrafo",
    texto: m.validacao.conforme
      ? "**Situação:** Sem erros bloqueantes."
      : "**Situação:** Há pendências que impedem o cadastro.",
  });
  if (m.validacao.pendencias.length) {
    const linhas: string[][] = [["Sev.", "Campo", "Pendência", "Fonte"]];
    for (const p of m.validacao.pendencias) {
      linhas.push([p.severidade, p.campo, p.mensagem, p.fonte ?? "-"]);
    }
    out.push({ tipo: "tabela", linhas, temCabecalho: true });
  }

  // Seções
  for (const s of m.secoes) {
    out.push({ tipo: "titulo", nivel: 1, texto: s.titulo });
    if (s.campoPlataforma)
      out.push({
        tipo: "paragrafo",
        texto: `Onde cadastrar: ${s.campoPlataforma}`,
      });
    out.push(...parseConteudo(s.conteudo));
  }

  // Checklist
  out.push({
    tipo: "titulo",
    nivel: 1,
    texto: "Checklist de cadastro (passo a passo)",
  });
  out.push({ tipo: "lista", itens: m.checklist });

  return out;
}
