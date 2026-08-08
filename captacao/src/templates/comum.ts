/** Utilidades compartilhadas pelos geradores de minuta. */
import type {
  DadosProponente,
  ProjetoReferencia,
  RubricaOrcamento,
} from "../types.ts";

export const PROPONENTE_PADRAO: DadosProponente = {
  nome: "Instituto Ubatuba",
  natureza:
    "Organização da sociedade civil (OSC) sem fins lucrativos — áreas de saúde e educação",
  cidade: "Ubatuba",
  uf: "SP",
  responsavelLegal: "«Nome do Responsável Legal»",
  cnpj: "«CNPJ do proponente»",
};

export function reais(n: number): string {
  return (
    "R$ " +
    n.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function pct(n: number): string {
  return (n * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "%";
}

/** Texto curto citando os projetos de referência recuperados da base. */
export function blocoReferencias(refs: ProjetoReferencia[]): string {
  if (refs.length === 0) {
    return "Nenhum projeto aprovado similar foi encontrado na base local. Rode a coleta (`cap collect`) para enriquecer as referências.";
  }
  const linhas = refs.map(r => {
    const valor =
      r.valor_aprovado != null ? ` — aprovado: ${reais(r.valor_aprovado)}` : "";
    const area = r.area ? ` [${r.area}]` : "";
    return `- **${r.titulo}**${area} (${r.identificador})${valor}${r.proponente ? ` — ${r.proponente}` : ""}`;
  });
  return linhas.join("\n");
}

/** Tabela markdown da planilha orçamentária. */
export function tabelaOrcamento(rubricas: RubricaOrcamento[]): string {
  const total = rubricas.reduce((s, r) => s + r.valor, 0);
  const cab = "| Etapa/Rubrica | Descrição | Valor | % |\n|---|---|---:|---:|";
  const linhas = rubricas.map(
    r =>
      `| ${r.categoria} | ${r.descricao} | ${reais(r.valor)} | ${total ? pct(r.valor / total) : "-"} |`
  );
  linhas.push(`| **TOTAL** | | **${reais(total)}** | **100%** |`);
  return [cab, ...linhas].join("\n");
}

/** Distribui um valor total nas rubricas, respeitando um teto administrativo. */
export function distribuir(
  total: number,
  fatias: Array<{ categoria: string; descricao: string; pct: number }>
): RubricaOrcamento[] {
  return fatias.map(f => ({
    categoria: f.categoria,
    descricao: f.descricao,
    valor: Math.round(total * f.pct * 100) / 100,
  }));
}
