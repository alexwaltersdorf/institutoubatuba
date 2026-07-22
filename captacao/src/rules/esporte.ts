/**
 * Regras e limites da Lei de Incentivo ao Esporte (LIE) — regime vigente 2026.
 *
 * FONTES (docs/normativos/esporte/00-RESUMO-NORMATIVO.md e fontes-oficiais/):
 *  - Lei Complementar nº 222/2025 (revoga a Lei 11.438/2006)
 *  - Decreto nº 12.861/2026 (revoga o Decreto 6.180/2007)
 *  - Portaria MESP nº 10/2026 (regulamento operacional)
 *
 * Regra de ouro: o texto oficial vence a memória. Onde o número não pôde ser
 * confirmado em fonte primária, o campo é `null` e marcado como [VERIFICAR].
 */
import type { Pendencia, RubricaOrcamento } from "../types.ts";
import { VERIFICAR } from "../types.ts";

/** Níveis da prática esportiva (nomenclatura da LC 222/2025 / Decreto 12.861/2026, art. 5º). */
export const NIVEIS_ESPORTE = {
  formacao: {
    codigo: "formacao",
    nome: "Formação esportiva",
    equivalenteAntigo: "educacional",
    tetoCaptacao: null as number | null, // "sem limite pré-estabelecido"
    contrapartidaMinRedePublica: 0.5, // art. 18: ≥50% alunos da rede pública
  },
  toda_vida: {
    codigo: "toda_vida",
    nome: "Esporte para toda a vida",
    equivalenteAntigo: "participação",
    tetoCaptacao: 2_500_000, // Portaria 10/2026 (fontes secundárias convergentes)
    contrapartidaMinRedePublica: 0,
  },
  excelencia: {
    codigo: "excelencia",
    nome: "Excelência esportiva",
    equivalenteAntigo: "rendimento",
    tetoCaptacao: 5_000_000, // Portaria 10/2026 (fontes secundárias convergentes)
    contrapartidaMinRedePublica: 0,
  },
} as const;

export type NivelEsporte = keyof typeof NIVEIS_ESPORTE;

export const LIMITES_ESPORTE = {
  /** Dedução IR — LC 222/2025 art. 9º; Decreto art. 3º. Período de transição até 2027. */
  deducao: {
    pessoaFisica: 0.07,
    pessoaJuridica_2026_2027: 0.02,
    pessoaJuridica_2028: 0.03,
    inclusaoSocial: 0.04,
  },
  /** Despesas administrativas (atividade-meio): máx 15% do orçamento — Decreto art. 12. */
  administrativoMax: 0.15,
  /**
   * Elaboração + captação: limites fixados pela Portaria MESP 10/2026, com gradação por nível.
   * Fontes secundárias divergem — mantido como [VERIFICAR]. NÃO usar número inventado.
   * Valor provisório conservador usado apenas como ALERTA (não como erro).
   */
  elaboracaoCaptacaoMax: null as number | null, // [VERIFICAR] Portaria 10/2026
  elaboracaoCaptacaoAlertaProvisorio: 0.1, // hipótese (10%) apenas para gerar alerta
  /** Teto de projetos por proponente por ano-calendário — Decreto art. 23. */
  maxProjetosPorAno: 6,
  /** Funcionamento mínimo do proponente — Decreto art. 10, IX. */
  funcionamentoMinimoAnos: 1,
  /** Prazo de prestação de contas final — Decreto art. 33. */
  prazoPrestacaoContasDias: 60,
  /** Nº de metas no SLI: mínimo 2, máximo 5. */
  metasMin: 2,
  metasMax: 5,
} as const;

/** Vedações (Decreto 12.861/2026). */
export const VEDACOES_ESPORTE = [
  "Intermediação total do objeto do projeto (art. 13, §1º).",
  "Aquisição de espaços publicitários com recurso incentivado (art. 14).",
  "Cobrança de beneficiários em projetos de prática regular — gratuidade (art. 16).",
  "Remuneração de atleta profissional / manutenção de equipes profissionais (art. 6º).",
  "Subcontratação de gestão, coordenação ou direção do projeto (art. 13, §3º).",
];

export interface OrcamentoEsporte {
  atividadeFim: number;
  atividadeMeio: number; // administrativo
  elaboracaoCaptacao: number;
}

/** Soma as rubricas por categoria conhecida da LIE. */
export function consolidarOrcamentoEsporte(
  rubricas: RubricaOrcamento[]
): OrcamentoEsporte {
  const soma = (cat: string) =>
    rubricas.filter(r => r.categoria === cat).reduce((s, r) => s + r.valor, 0);
  return {
    atividadeFim: soma("atividade_fim"),
    atividadeMeio: soma("atividade_meio"),
    elaboracaoCaptacao: soma("elaboracao_captacao"),
  };
}

/** Valida um projeto de esporte contra os limites vigentes. */
export function validarEsporte(params: {
  nivel: NivelEsporte;
  valorTotal: number;
  orcamento: OrcamentoEsporte;
  temAcessibilidade: boolean;
  percentualRedePublica?: number; // 0..1
  nMetas?: number;
}): Pendencia[] {
  const p: Pendencia[] = [];
  const nivel = NIVEIS_ESPORTE[params.nivel];
  const { valorTotal, orcamento } = params;
  const fonteDec =
    "Decreto 12.861/2026 (docs/normativos/esporte/fontes-oficiais/Decreto-12861-2026.txt)";

  // Teto de captação por nível
  if (nivel.tetoCaptacao != null && valorTotal > nivel.tetoCaptacao) {
    p.push({
      severidade: "erro",
      campo: "valor_total",
      mensagem: `Valor (R$ ${fmt(valorTotal)}) excede o teto de captação do nível "${nivel.nome}" (R$ ${fmt(nivel.tetoCaptacao)}).`,
      fonte: "Portaria MESP 10/2026",
    });
  }

  // Administrativo ≤ 15%
  if (valorTotal > 0) {
    const pctAdmin = orcamento.atividadeMeio / valorTotal;
    if (pctAdmin > LIMITES_ESPORTE.administrativoMax + 1e-9) {
      p.push({
        severidade: "erro",
        campo: "orcamento.atividade_meio",
        mensagem: `Despesas administrativas (${pct(pctAdmin)}) acima do limite de 15% do orçamento total.`,
        fonte: `art. 12, ${fonteDec}`,
      });
    }

    // Elaboração/captação — limite não confirmado → alerta [VERIFICAR]
    const pctElab = orcamento.elaboracaoCaptacao / valorTotal;
    if (pctElab > LIMITES_ESPORTE.elaboracaoCaptacaoAlertaProvisorio + 1e-9) {
      p.push({
        severidade: "verificar",
        campo: "orcamento.elaboracao_captacao",
        mensagem: `Custo de elaboração+captação (${pct(pctElab)}) acima da hipótese provisória de 10%. ${VERIFICAR}: o limite oficial por nível está na Portaria MESP 10/2026 (não confirmado em fonte primária).`,
        fonte: "art. 13 §6º, Decreto 12.861/2026 (delega à Portaria 10/2026)",
      });
    }
  }

  // Contrapartida rede pública (formação)
  if (nivel.contrapartidaMinRedePublica > 0) {
    const pctRp = params.percentualRedePublica ?? 0;
    if (pctRp < nivel.contrapartidaMinRedePublica - 1e-9) {
      p.push({
        severidade: "erro",
        campo: "publico.rede_publica",
        mensagem: `Projetos de formação esportiva exigem ≥50% de alunos da rede pública; informado ${pct(pctRp)}.`,
        fonte: `art. 18, ${fonteDec}`,
      });
    }
  }

  // Acessibilidade obrigatória
  if (!params.temAcessibilidade) {
    p.push({
      severidade: "erro",
      campo: "acessibilidade",
      mensagem:
        "Falta previsão de acessibilidade para pessoas idosas e com deficiência (obrigatória).",
      fonte: `art. 17, ${fonteDec}`,
    });
  }

  // Metas
  const nMetas = params.nMetas ?? 0;
  if (nMetas < LIMITES_ESPORTE.metasMin || nMetas > LIMITES_ESPORTE.metasMax) {
    p.push({
      severidade: "alerta",
      campo: "metas",
      mensagem: `O SLI aceita de ${LIMITES_ESPORTE.metasMin} a ${LIMITES_ESPORTE.metasMax} metas; informadas ${nMetas}.`,
      fonte: "Portal 'Fases do Projeto' (SLI)",
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
