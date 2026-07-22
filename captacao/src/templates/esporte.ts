/**
 * Gerador de minuta — Lei de Incentivo ao Esporte (LIE), cadastro via SLI + SEI Cidadania.
 *
 * Espelha os campos do formulário do SLI ("Fases do Projeto") e os documentos do
 * art. 10 do Decreto 12.861/2026. Linguagem técnica alinhada aos projetos aprovados.
 * Placeholders «...» marcam informação que o proponente deve completar.
 * Ver docs/normativos/esporte/00-RESUMO-NORMATIVO.md.
 */
import type {
  BriefingProjeto,
  Minuta,
  RubricaOrcamento,
  SecaoMinuta,
} from "../types.ts";
import {
  NIVEIS_ESPORTE,
  type NivelEsporte,
  VEDACOES_ESPORTE,
  LIMITES_ESPORTE,
  consolidarOrcamentoEsporte,
  validarEsporte,
} from "../rules/esporte.ts";
import { PROPONENTE_PADRAO, reais, blocoReferencias } from "./comum.ts";
import type { ProjetoReferencia } from "../types.ts";

/** Resolve o nível a partir do texto da área do briefing (aceita nomenclatura antiga). */
export function resolverNivel(area: string): NivelEsporte {
  const a = area.toLowerCase();
  if (/(formaç|educa)/.test(a)) return "formacao";
  if (/(toda|particip)/.test(a)) return "toda_vida";
  if (/(excel|rendiment|alto)/.test(a)) return "excelencia";
  return "formacao";
}

function orcamentoPadrao(total: number): RubricaOrcamento[] {
  // Distribuição conservadora: admin ≤15% do total; elaboração/captação em faixa provisória.
  const admin = Math.round(total * 0.15 * 100) / 100;
  const elab = Math.round(total * 0.08 * 100) / 100;
  const fim = Math.round((total - admin - elab) * 100) / 100;
  return [
    {
      categoria: "atividade_fim",
      descricao:
        "Execução direta: profissionais de educação física/técnicos, material esportivo, locação de espaços, transporte e uniformes dos beneficiários",
      valor: fim,
    },
    {
      categoria: "atividade_meio",
      descricao:
        "Despesas administrativas (coordenação, contabilidade, gestão) — limitado a 15% (art. 12)",
      valor: admin,
    },
    {
      categoria: "elaboracao_captacao",
      descricao:
        "Elaboração do projeto + captação de recursos — [VERIFICAR] limite oficial na Portaria MESP 10/2026 por nível",
      valor: elab,
    },
  ];
}

export function gerarMinutaEsporte(
  briefing: BriefingProjeto,
  refs: ProjetoReferencia[]
): Minuta {
  const nivelKey = resolverNivel(briefing.area);
  const nivel = NIVEIS_ESPORTE[nivelKey];
  const prop = { ...PROPONENTE_PADRAO, ...briefing.proponente };
  const orcamento = orcamentoPadrao(briefing.valorEstimado);
  const cons = consolidarOrcamentoEsporte(orcamento);
  const ehFormacao = nivelKey === "formacao";

  const secoes: SecaoMinuta[] = [
    {
      titulo: "1. Identificação do proponente",
      campoPlataforma: "SLI › Cadastro do Proponente",
      conteudo:
        `**Proponente:** ${prop.nome}\n` +
        `**Natureza:** ${prop.natureza}\n` +
        `**CNPJ:** ${prop.cnpj}\n` +
        `**Município/UF:** ${prop.cidade}/${prop.uf}\n` +
        `**Responsável legal:** ${prop.responsavelLegal}\n` +
        `**Tempo de funcionamento:** «≥ 1 ano — exigência do art. 10, IX do Decreto 12.861/2026»`,
    },
    {
      titulo: "2. Manifestação desportiva / Nível da prática esportiva",
      campoPlataforma: "SLI › Manifestação Desportiva",
      conteudo:
        `**Nível (nomenclatura vigente — LC 222/2025):** ${nivel.nome}\n` +
        `**Equivalente na nomenclatura anterior (ainda exibida no SLI em transição):** ${nivel.equivalenteAntigo}\n` +
        `**Desporto/paradesporto:** «modalidade(s), ex.: futsal, natação, atletismo»\n` +
        `**Destinação:** «obra | evento | atividade regular»`,
    },
    {
      titulo: "3. Objeto",
      campoPlataforma: "SLI › Definição › Objeto",
      conteudo:
        `${briefing.titulo}. ${briefing.resumo}\n\n` +
        `O projeto será executado em ${briefing.cidade}, atendendo ${briefing.publico}.`,
    },
    {
      titulo: "4. Justificativa",
      campoPlataforma: "SLI › Dados complementares › Justificativa",
      conteudo:
        `A prática esportiva orientada é instrumento de desenvolvimento humano, inclusão social e promoção da saúde. ` +
        `Em ${briefing.cidade}, «apresentar diagnóstico local: indicadores de vulnerabilidade, ausência de oferta esportiva regular, dados do público-alvo». ` +
        `${ehFormacao ? "Como projeto de formação esportiva, prioriza crianças e adolescentes, com pelo menos 50% de alunos da rede pública de ensino (art. 18). " : ""}` +
        `A iniciativa dialoga com projetos já aprovados na LIE, que demonstram a viabilidade técnica e orçamentária desta abordagem (ver referências ao final).`,
    },
    {
      titulo: "5. Objetivo geral e objetivos específicos",
      campoPlataforma: "SLI › Dados complementares › Objetivo",
      conteudo:
        `**Objetivo geral:** «formular em uma frase, ex.: promover a prática esportiva regular e a formação cidadã de ${briefing.publico} em ${briefing.cidade}».\n\n` +
        `**Objetivos específicos:**\n` +
        `1. «Oferecer aulas regulares de «modalidade» para «nº» beneficiários».\n` +
        `2. «Desenvolver valores de disciplina, cooperação e respeito por meio do esporte».\n` +
        `3. «Ampliar o acesso de pessoas com deficiência e idosas à prática esportiva (acessibilidade — art. 17)».`,
    },
    {
      titulo: "6. Metas qualitativas e quantitativas (com indicadores)",
      campoPlataforma: "SLI › Metas (mín. 2, máx. 5)",
      conteudo:
        `| # | Meta | Indicador | Verificador |\n|---|---|---|---|\n` +
        `| 1 | Atender «nº» beneficiários em aulas regulares | Nº de matriculados / frequência ≥ 75% | Lista de presença, fichas de matrícula |\n` +
        `| 2 | Realizar «nº» horas/aula ao longo de «nº» meses | Horas/aula executadas | Cronograma, diário de aulas |\n` +
        `| 3 | Garantir ≥ «%» de alunos da rede pública${ehFormacao ? " (mín. 50%)" : ""} | % de alunos da rede pública | Declaração escolar |\n` +
        `\n_Use de 2 a 5 metas (limite do SLI). Cada meta deve ter indicador e meio de verificação._`,
    },
    {
      titulo: "7. Metodologia",
      campoPlataforma: "SLI › Dados complementares › Metodologia",
      conteudo:
        `«Descrever a abordagem pedagógico-esportiva: periodização das aulas, faixas/turmas, profissionais responsáveis (educadores físicos com CREF), ` +
        `critérios de seleção e matrícula, avaliação de desenvolvimento, e articulação com escolas/rede de saúde do município».`,
    },
    {
      titulo: "8. Público beneficiário",
      campoPlataforma: "SLI › Público beneficiário",
      conteudo:
        `**Quem:** ${briefing.publico}\n` +
        `**Quantidade:** «nº total de beneficiários diretos»\n` +
        `**Faixa etária:** «ex.: 6 a 17 anos»\n` +
        `**Critérios de seleção:** «ex.: matrícula na rede pública, residência em áreas prioritárias, ordem de inscrição»\n` +
        `**Pessoas com deficiência:** «prever vagas e adaptações — acessibilidade obrigatória (art. 17)»` +
        (ehFormacao ? `\n**Alunos da rede pública:** «≥ 50% — art. 18»` : ""),
    },
    {
      titulo: "9. Plano de trabalho e estratégias de ação",
      campoPlataforma: "SLI › Descrição do projeto (art. 10, VI)",
      conteudo:
        `«Detalhar as ações por fase: (a) mobilização e inscrições; (b) execução das atividades esportivas; ` +
        `(c) eventos/festivais de integração; (d) monitoramento e avaliação. Indicar estratégias de ação para cada objetivo específico».`,
    },
    {
      titulo: "10. Equipe e atribuições",
      campoPlataforma: "SLI › Ficha técnica / Equipe",
      conteudo:
        `| Função | Qtde | Atribuição | Vínculo |\n|---|---|---|---|\n` +
        `| Coordenador(a) geral | 1 | Gestão e articulação | «CLT/RPA» |\n` +
        `| Profissional de Educação Física (CREF) | «nº» | Ministrar aulas | «CLT/RPA» |\n` +
        `| Auxiliar/estagiário | «nº» | Apoio às turmas | «...» |\n` +
        `| Administrativo/financeiro | 1 | Gestão de contas e prestação de contas | «...» |`,
    },
    {
      titulo: "11. Cronograma físico e financeiro",
      campoPlataforma: "SLI › Cronograma (art. 10, VI, c)",
      conteudo:
        `«Distribuir as ações e os desembolsos ao longo dos meses de execução. Exemplo:»\n\n` +
        `| Ação | Mês 1 | Mês 2 | ... | Mês N |\n|---|---|---|---|---|\n` +
        `| Inscrições e matrículas | X | | | |\n` +
        `| Aulas regulares | | X | X | X |\n` +
        `| Evento de encerramento | | | | X |\n` +
        `| Prestação de contas final | | | | X (até 60 dias após o término — art. 33) |`,
    },
    {
      titulo: "12. Planilha orçamentária por etapa/rubrica",
      campoPlataforma: "SLI › Orçamento (3 etapas)",
      conteudo:
        `Estrutura em 3 etapas do SLI:\n\n` +
        `| Etapa | Rubrica | Valor |\n|---|---|---:|\n` +
        `| 1 — Atividade-fim | Execução direta | ${reais(cons.atividadeFim)} |\n` +
        `| 2 — Atividade-meio | Administrativo (≤ 15% — art. 12) | ${reais(cons.atividadeMeio)} |\n` +
        `| 3 — Elaboração + captação | [VERIFICAR] limite por nível (Portaria 10/2026) | ${reais(cons.elaboracaoCaptacao)} |\n` +
        `| **TOTAL** | | **${reais(briefing.valorEstimado)}** |\n\n` +
        `_Detalhe cada rubrica com item, unidade, quantidade e valor unitário compatível com o mercado (art. 10, VII)._`,
    },
    {
      titulo: "13. Contrapartidas",
      campoPlataforma: "SLI › Descrição do projeto",
      conteudo:
        (ehFormacao
          ? `Contrapartida social: no mínimo 50% de alunos regularmente matriculados na rede pública de ensino (art. 18). `
          : `«Definir contrapartidas sociais e de gratuidade aplicáveis ao nível ${nivel.nome}». `) +
        `Gratuidade total aos beneficiários em atividades de prática regular (art. 16). Acessibilidade a idosos e PCD (art. 17).`,
    },
    {
      titulo: "14. Plano de divulgação",
      campoPlataforma: "SLI › Descrição do projeto",
      conteudo:
        `«Plano de comunicação do projeto: peças, canais (redes sociais, imprensa local), aplicação da marca dos patrocinadores e do Ministério do Esporte conforme manual de identidade». ` +
        `**Atenção:** é vedado usar recurso incentivado para aquisição de espaços publicitários (art. 14).`,
    },
    {
      titulo: "15. Referências (projetos aprovados similares)",
      conteudo: blocoReferencias(refs),
    },
    {
      titulo: "Vedações a observar",
      conteudo: VEDACOES_ESPORTE.map(v => `- ${v}`).join("\n"),
    },
  ];

  const validacao = {
    conforme: true,
    pendencias: validarEsporte({
      nivel: nivelKey,
      valorTotal: briefing.valorEstimado,
      orcamento: cons,
      temAcessibilidade: true, // a minuta inclui acessibilidade por padrão
      percentualRedePublica: ehFormacao ? 0.5 : undefined,
      nMetas: 3,
    }),
  };
  validacao.conforme = !validacao.pendencias.some(p => p.severidade === "erro");

  return {
    lei: "esporte",
    briefing,
    secoes,
    orcamento,
    referencias: refs,
    validacao,
    checklist: checklistEsporte(nivel.nome),
    geradoEm: new Date().toISOString(),
  };
}

function checklistEsporte(nomeNivel: string): string[] {
  return [
    "Acesse o SLI — Sistema da Lei de Incentivo: https://sli.mds.gov.br/ e faça login (conta gov.br).",
    "Cadastre/atualize o Proponente (seção 1 desta minuta): CNPJ, ato constitutivo, ata de posse da diretoria, comprovação de ≥1 ano de funcionamento.",
    `Crie novo projeto → em "Manifestação Desportiva/Nível" selecione: ${nomeNivel} (seção 2).`,
    'Preencha "Definição": título e Objeto (seção 3) e período de execução.',
    'Preencha "Dados complementares": Objetivo (seção 5), Metodologia (seção 7) e Justificativa (seção 4).',
    "Cadastre as Metas (seção 6) — de 2 a 5, cada uma com indicador e verificador.",
    'Preencha "Público beneficiário" (seção 8): tipo, faixa etária, quantidade e PCD.',
    "Monte o Orçamento nas 3 etapas do SLI (seção 12): atividade-fim, atividade-meio (≤15%) e elaboração+captação.",
    "Anexe documentos (art. 10): CNPJ, ato constitutivo, ata de posse, CPF/RG dos responsáveis, orçamento analítico com comprovação de preços, capacidade técnico-operativa. PDF pesquisável (OCR).",
    'Revise pendências em "Finalização" e envie o projeto dentro da janela de apresentação (04/03–18/09/2026 — [VERIFICAR] na Portaria 10/2026).',
    "Após aprovação: o Responsável Legal assina o Termo de Compromisso no SEI Cidadania (cadastro de usuário externo; confirmação a execucao.incentivo@esporte.gov.br) em até 180 dias, com assinatura gov.br/ICP-Brasil.",
    "Abra conta bancária específica (Banco do Brasil ou Caixa) em nome do proponente e inicie a captação.",
  ];
}
