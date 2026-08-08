/**
 * Regras e limites da Lei de Incentivo à Cultura (Lei Rouanet / PRONAC) — vigente 2026.
 *
 * FONTES (docs/normativos/cultura/00-RESUMO-NORMATIVO.md e fontes-oficiais/):
 *  - Lei nº 8.313/1991 (texto compilado)
 *  - Decreto nº 11.453/2023 (revoga o Decreto 10.755/2021)
 *  - Instrução Normativa MinC nº 29/2026 (limites citados artigo por artigo)
 *  - Lei nº 13.146/2015 (LBI) — origem da acessibilidade obrigatória
 */
import type { Pendencia, RubricaOrcamento } from "../types.ts";

/** Áreas culturais (VerSALIC). */
export const AREAS_CULTURA: Record<string, string> = {
  "1": "Artes Cênicas",
  "2": "Audiovisual",
  "3": "Música",
  "4": "Artes Visuais",
  "5": "Patrimônio Cultural",
  "6": "Humanidades",
  "7": "Artes Integradas",
  "9": "Museus e Memória",
};

/** Enquadramento (mecanismo de dedução). */
export const ENQUADRAMENTO_CULTURA = {
  art18: {
    codigo: "art18",
    nome: "Art. 18 — dedução de 100%",
    deducaoPF: 1.0,
    deducaoPJ: 1.0,
    segmentosElegiveis:
      "artes cênicas; livros de valor artístico/literário/humanístico; música erudita, instrumental ou regional; exposições de artes visuais; doações de acervos a bibliotecas/museus/arquivos públicos e cinematecas",
  },
  art26: {
    codigo: "art26",
    nome: "Art. 26 — dedução parcial",
    deducaoPF_doacao: 0.8,
    deducaoPF_patrocinio: 0.6,
    deducaoPJ_doacao: 0.4,
    deducaoPJ_patrocinio: 0.3,
  },
} as const;

export type Enquadramento = keyof typeof ENQUADRAMENTO_CULTURA;

/** Limites orçamentários — IN MinC nº 29/2026 (citação direta no resumo normativo). */
export const LIMITES_CULTURA = {
  /** Captação (agenciamento): 10% do projeto E teto R$ 150.000 — art. 19. */
  captacaoMaxPct: 0.1,
  captacaoTetoAbsoluto: 150_000,
  /** Acessibilidade + comunicação/divulgação acessíveis: máx 20% — art. 20. */
  acessibilidadeMaxPct: 0.2,
  /** Custos de administração: máx 15% — art. 22. */
  administracaoMaxPct: 0.15,
  /** Remuneração do próprio proponente: máx 20% do captado — art. 23. */
  remuneracaoProponenteMaxPct: 0.2,
  /** Contrapartida social (democratização) — art. 44. */
  contrapartida: {
    pctPublico: 0.1,
    minBeneficiarios: 20,
    maxBeneficiarios: 500,
  },
} as const;

/** Tetos por proponente / por projeto — IN 29/2026 arts. 10–13. */
export const TETOS_CULTURA = {
  pessoaFisica: { projetosAtivos: 2, carteira: 500_000, porProjeto: 500_000 },
  mei: { projetosAtivos: 4, carteira: 1_500_000, porProjeto: 1_500_000 },
  demaisPJ: { projetosAtivos: 10, carteira: 15_000_000, porProjeto: 1_500_000 },
  especialItinerancia: 6_000_000, // art. 12
  especialGrandesEventos: 15_000_000, // art. 13
} as const;

export type TipoProponente = keyof Pick<
  typeof TETOS_CULTURA,
  "pessoaFisica" | "mei" | "demaisPJ"
>;

/** Vedações — IN 29/2026 art. 32. */
export const VEDACOES_CULTURA = [
  "Difusão de imagem de agente político (art. 32, I).",
  "Proponente ligado a agente político ou a servidor do MinC (art. 32, II).",
  "Administração pública direta como proponente (art. 32, III).",
  "Construção de portais, estátuas ou réplicas em logradouros (art. 32, IV).",
  "Bolsas de graduação/pós-graduação (art. 32, V).",
  "Proselitismo ou culto religioso (art. 32, VI).",
  "Fracionamento de projetos (art. 32, VII).",
];

export interface OrcamentoCultura {
  captacao: number;
  acessibilidade: number;
  administracao: number;
}

export function consolidarOrcamentoCultura(
  rubricas: RubricaOrcamento[]
): OrcamentoCultura {
  const soma = (cat: string) =>
    rubricas.filter(r => r.categoria === cat).reduce((s, r) => s + r.valor, 0);
  return {
    captacao: soma("captacao"),
    acessibilidade: soma("acessibilidade"),
    administracao: soma("administracao"),
  };
}

export function validarCultura(params: {
  enquadramento: Enquadramento;
  tipoProponente: TipoProponente;
  valorTotal: number;
  orcamento: OrcamentoCultura;
  temAcessibilidade: boolean;
  temDemocratizacao: boolean;
}): Pendencia[] {
  const p: Pendencia[] = [];
  const { valorTotal, orcamento } = params;
  const fonteIN =
    "IN MinC 29/2026 (docs/normativos/cultura/fontes-oficiais/IN-MinC-29-2026.html)";

  // Teto por projeto conforme tipo de proponente
  const teto = TETOS_CULTURA[params.tipoProponente].porProjeto;
  if (valorTotal > teto) {
    p.push({
      severidade: "alerta",
      campo: "valor_total",
      mensagem: `Valor (R$ ${fmt(valorTotal)}) acima do teto ordinário por projeto (R$ ${fmt(teto)}) para ${params.tipoProponente}. Verifique se se enquadra em teto especial (art. 12/13).`,
      fonte: `arts. 11–13, ${fonteIN}`,
    });
  }

  if (valorTotal > 0) {
    // Captação: 10% E teto R$ 150k
    const pctCap = orcamento.captacao / valorTotal;
    if (pctCap > LIMITES_CULTURA.captacaoMaxPct + 1e-9) {
      p.push({
        severidade: "erro",
        campo: "orcamento.captacao",
        mensagem: `Custo de captação (${pct(pctCap)}) acima do limite de 10% do valor do projeto.`,
        fonte: `art. 19, ${fonteIN}`,
      });
    }
    if (orcamento.captacao > LIMITES_CULTURA.captacaoTetoAbsoluto + 1e-9) {
      p.push({
        severidade: "erro",
        campo: "orcamento.captacao",
        mensagem: `Custo de captação (R$ ${fmt(orcamento.captacao)}) acima do teto absoluto de R$ 150.000,00.`,
        fonte: `art. 19, ${fonteIN}`,
      });
    }

    // Administração ≤ 15%
    const pctAdm = orcamento.administracao / valorTotal;
    if (pctAdm > LIMITES_CULTURA.administracaoMaxPct + 1e-9) {
      p.push({
        severidade: "erro",
        campo: "orcamento.administracao",
        mensagem: `Custos de administração (${pct(pctAdm)}) acima do limite de 15% do valor do projeto.`,
        fonte: `art. 22, ${fonteIN}`,
      });
    }

    // Acessibilidade ≤ 20%
    const pctAcs = orcamento.acessibilidade / valorTotal;
    if (pctAcs > LIMITES_CULTURA.acessibilidadeMaxPct + 1e-9) {
      p.push({
        severidade: "alerta",
        campo: "orcamento.acessibilidade",
        mensagem: `Custos de acessibilidade+divulgação acessível (${pct(pctAcs)}) acima do limite de 20% do valor do projeto.`,
        fonte: `art. 20, ${fonteIN}`,
      });
    }
  }

  // Acessibilidade obrigatória (Lei 13.146/2015; art. 38 IN 29/2026)
  if (!params.temAcessibilidade) {
    p.push({
      severidade: "erro",
      campo: "acessibilidade",
      mensagem:
        "Falta plano de acessibilidade (arquitetônica, comunicacional e de divulgação). Obrigatório.",
      fonte: "Lei 13.146/2015 (LBI) + art. 38, IN 29/2026",
    });
  }

  // Democratização de acesso
  if (!params.temDemocratizacao) {
    p.push({
      severidade: "alerta",
      campo: "democratizacao",
      mensagem: "Falta plano de democratização de acesso.",
      fonte: `art. 44, ${fonteIN}`,
    });
  }

  return p;
}

function fmt(n: number): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function pct(n: number): string {
  return (n * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "%";
}
