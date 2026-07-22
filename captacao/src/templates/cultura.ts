/**
 * Gerador de minuta — Lei de Incentivo à Cultura (Lei Rouanet / PRONAC), cadastro via SALIC.
 *
 * Espelha as abas/campos do formulário do SALIC (Manual do Proponente Módulo I) e os
 * limites da IN MinC nº 29/2026. Acessibilidade e democratização são obrigatórias.
 * Ver docs/normativos/cultura/00-RESUMO-NORMATIVO.md.
 */
import type {
  BriefingProjeto,
  Minuta,
  RubricaOrcamento,
  SecaoMinuta,
  ProjetoReferencia,
} from "../types.ts";
import {
  ENQUADRAMENTO_CULTURA,
  type Enquadramento,
  type TipoProponente,
  VEDACOES_CULTURA,
  consolidarOrcamentoCultura,
  validarCultura,
  LIMITES_CULTURA,
} from "../rules/cultura.ts";
import { PROPONENTE_PADRAO, reais, blocoReferencias } from "./comum.ts";

/** Heurística de enquadramento: art. 18 se o segmento for elegível a 100%; senão art. 26. */
export function resolverEnquadramento(area: string): Enquadramento {
  const a = area.toLowerCase();
  if (
    /(cênic|cenic|música erudita|artes visuais|livro|teatro|dança|circo)/.test(
      a
    )
  )
    return "art18";
  return "art26";
}

function orcamentoPadrao(total: number): RubricaOrcamento[] {
  // Distribuição conservadora respeitando os limites da IN 29/2026.
  const captacao = Math.min(
    Math.round(total * 0.1 * 100) / 100,
    LIMITES_CULTURA.captacaoTetoAbsoluto
  );
  const acessibilidade = Math.round(total * 0.1 * 100) / 100; // dentro do teto de 20%
  const administracao = Math.round(total * 0.12 * 100) / 100; // dentro do teto de 15%
  const producao =
    Math.round((total - captacao - acessibilidade - administracao) * 100) / 100;
  return [
    {
      categoria: "producao",
      descricao:
        "Custos por produto: equipe artística/técnica, produção, equipamentos, locações e materiais",
      valor: producao,
    },
    {
      categoria: "acessibilidade",
      descricao:
        "Recursos de acessibilidade (audiodescrição, LIBRAS, legendagem, adequação arquitetônica) + divulgação acessível — máx. 20% (art. 20)",
      valor: acessibilidade,
    },
    {
      categoria: "administracao",
      descricao: "Custos de administração — máx. 15% (art. 22)",
      valor: administracao,
    },
    {
      categoria: "captacao",
      descricao:
        "Remuneração para captação de recursos — máx. 10% e teto R$ 150.000 (art. 19)",
      valor: captacao,
    },
  ];
}

export function gerarMinutaCultura(
  briefing: BriefingProjeto,
  refs: ProjetoReferencia[]
): Minuta {
  const enqKey = resolverEnquadramento(briefing.area);
  const enq = ENQUADRAMENTO_CULTURA[enqKey];
  const prop = { ...PROPONENTE_PADRAO, ...briefing.proponente };
  const tipoProp: TipoProponente = prop.cnpj ? "demaisPJ" : "pessoaFisica";
  const orcamento = orcamentoPadrao(briefing.valorEstimado);
  const cons = consolidarOrcamentoCultura(orcamento);

  const secoes: SecaoMinuta[] = [
    {
      titulo: "1. Identificação e enquadramento",
      campoPlataforma: "SALIC › Nova Proposta › Tipicidade/Tipologias",
      conteudo:
        `**Proponente:** ${prop.nome} (${prop.natureza})\n` +
        `**CNPJ:** ${prop.cnpj} — **Município/UF:** ${prop.cidade}/${prop.uf}\n` +
        `**Mecanismo:** ${enq.nome}\n` +
        (enqKey === "art18"
          ? `**Segmentos elegíveis ao art. 18 (dedução 100%):** ${ENQUADRAMENTO_CULTURA.art18.segmentosElegiveis}\n`
          : `**Dedução (art. 26):** PF 80% doação / 60% patrocínio · PJ 40% doação / 30% patrocínio\n`) +
        `**Área/segmento cultural:** ${briefing.area}`,
    },
    {
      titulo: "2. Nome e resumo da proposta (objeto)",
      campoPlataforma: "SALIC › Resumo da Proposta Cultural",
      conteudo: `**Nome:** ${briefing.titulo}\n\n${briefing.resumo}\n\nExecução em ${briefing.cidade}, para ${briefing.publico}.`,
    },
    {
      titulo: "3. Objetivos",
      campoPlataforma: "SALIC › Objetivos",
      conteudo:
        `**Objetivo geral:** «uma frase».\n\n**Objetivos específicos:**\n` +
        `1. «...»\n2. «...»\n3. «Garantir acesso de pessoas com deficiência (acessibilidade)».\n\n` +
        `_Evite clichês vetados pelo manual: "levar/propagar a cultura", "gerar empregos", "transformar vidas"._`,
    },
    {
      titulo: "4. Justificativa",
      campoPlataforma: "SALIC › Justificativa",
      conteudo:
        `«Apresentar o contexto cultural de ${briefing.cidade}, a relevância do segmento «${briefing.area}», o diagnóstico do público-alvo e a pertinência do projeto». ` +
        `A proposta se apoia em projetos aprovados similares (ver referências), o que respalda a estrutura, a linguagem e o orçamento.`,
    },
    {
      titulo: "5. Acessibilidade (OBRIGATÓRIA)",
      campoPlataforma: "SALIC › Acessibilidade",
      conteudo:
        `Medidas nas três dimensões exigidas (Lei 13.146/2015; art. 38 da IN 29/2026):\n` +
        `- **Arquitetônica:** «rampas, banheiros adaptados, espaços reservados».\n` +
        `- **Comunicacional/de conteúdo:** «audiodescrição, LIBRAS, legendagem, materiais em formato acessível».\n` +
        `- **De comunicação/divulgação acessível:** «peças de divulgação com recursos de acessibilidade».\n\n` +
        `Custos de acessibilidade + divulgação acessível: máx. 20% do projeto (art. 20).`,
    },
    {
      titulo: "6. Democratização de acesso",
      campoPlataforma: "SALIC › Democratização de Acesso",
      conteudo:
        `«Política de gratuidade/meia-entrada, distribuição de ingressos a escolas públicas e comunidades, ações formativas». ` +
        `Contrapartida social: ações formativas correspondentes a ≥10% do público do produto principal (mín. 20, máx. 500 beneficiários) — art. 44.`,
    },
    {
      titulo: "7. Plano de distribuição do produto cultural",
      campoPlataforma: "SALIC › Plano de Distribuição",
      conteudo:
        `**Produto principal:** «ex.: exibições públicas gratuitas do documentário; nº de sessões».\n` +
        `**Produtos secundários / contrapartidas sociais:** «cópias para acervos, exibições em escolas, disponibilização on-line».\n` +
        `**Forma de distribuição:** «gratuita | venda | misto» — detalhar quantidades e destinos.`,
    },
    {
      titulo: "8. Etapas de trabalho",
      campoPlataforma: "SALIC › Etapas de Trabalho",
      conteudo:
        `| Etapa | Descrição | Período |\n|---|---|---|\n` +
        `| Pré-produção | «pesquisa, roteiro, contratações, licenciamentos» | «mês 1–2» |\n` +
        `| Produção | «gravações/execução da atividade principal» | «mês 3–5» |\n` +
        `| Divulgação | «campanha, peças, assessoria — inclui divulgação acessível» | «mês 5–6» |\n` +
        `| Pós-produção | «edição, finalização, distribuição, prestação de contas» | «mês 6–7» |`,
    },
    {
      titulo: "9. Ficha técnica",
      campoPlataforma: "SALIC › Ficha Técnica",
      conteudo:
        `| Função | Profissional | Qualificação |\n|---|---|---|\n` +
        `| Coordenação/direção | «nome» | «currículo resumido» |\n` +
        `| Equipe técnica principal | «...» | «...» |\n` +
        `| Responsável por acessibilidade | «...» | «...» |\n\n` +
        `_Anexar minicurrículos e portfólio conforme Anexo II da IN._`,
    },
    {
      titulo: "10. Especificações técnicas do produto",
      campoPlataforma: "SALIC › Especificações Técnicas / Sinopse",
      conteudo:
        `**Sinopse:** «resumo da obra/produto».\n` +
        `**Especificações:** «formato, duração, tiragem, suporte, idioma, classificação — conforme o segmento».`,
    },
    {
      titulo: "11. Planilha orçamentária",
      campoPlataforma: "SALIC › Orçamento › Itens Orçamentários",
      conteudo:
        `| Rubrica | Descrição | Valor | Limite |\n|---|---|---:|---|\n` +
        `| Produção (custos por produto) | Execução direta | ${reais(cons_prod(orcamento))} | — |\n` +
        `| Acessibilidade + divulgação acessível | Recursos de acessibilidade | ${reais(cons.acessibilidade)} | ≤ 20% (art. 20) |\n` +
        `| Administração | Custos administrativos | ${reais(cons.administracao)} | ≤ 15% (art. 22) |\n` +
        `| Captação | Remuneração de captação | ${reais(cons.captacao)} | ≤ 10% e R$ 150k (art. 19) |\n` +
        `| **TOTAL** | | **${reais(briefing.valorEstimado)}** | |\n\n` +
        `_Compatibilize cada item com valores praticados (referência: Salic Comparar — https://aplicacoes.cultura.gov.br/comparar/)._`,
    },
    {
      titulo: "12. Plano de divulgação",
      campoPlataforma:
        "SALIC › (embutido em Acessibilidade de comunicação e nos custos por produto)",
      conteudo: `«Estratégia de comunicação: canais, peças, cronograma, aplicação das marcas conforme manual da Lei Rouanet, e recursos de acessibilidade na divulgação».`,
    },
    {
      titulo: "13. Local de realização",
      campoPlataforma: "SALIC › Local de Realização",
      conteudo: `«Municípios/espaços de execução e de fruição pública — incluir ${briefing.cidade}».`,
    },
    {
      titulo: "14. Referências (projetos aprovados similares)",
      conteudo: blocoReferencias(refs),
    },
    {
      titulo: "Vedações a observar",
      conteudo: VEDACOES_CULTURA.map(v => `- ${v}`).join("\n"),
    },
  ];

  const pend = validarCultura({
    enquadramento: enqKey,
    tipoProponente: tipoProp,
    valorTotal: briefing.valorEstimado,
    orcamento: cons,
    temAcessibilidade: true,
    temDemocratizacao: true,
  });
  const validacao = {
    conforme: !pend.some(p => p.severidade === "erro"),
    pendencias: pend,
  };

  return {
    lei: "cultura",
    briefing,
    secoes,
    orcamento,
    referencias: refs,
    validacao,
    checklist: checklistCultura(enq.nome),
    geradoEm: new Date().toISOString(),
  };
}

function cons_prod(orc: RubricaOrcamento[]): number {
  return orc
    .filter(r => r.categoria === "producao")
    .reduce((s, r) => s + r.valor, 0);
}

function checklistCultura(nomeEnq: string): string[] {
  return [
    "Acesse o SALIC: https://salic.cultura.gov.br e faça login (conta gov.br).",
    "Menu Proposta › Listar → selecione o proponente (PF/CPF ou PJ/CNPJ) → Nova Proposta → aceite a Declaração de responsabilidade.",
    `Em "Tipicidade/Tipologias", selecione o enquadramento: ${nomeEnq} e o segmento cultural (seção 1). Isso define o teto orçamentário.`,
    'Preencha Nome, "Resumo da Proposta" (objeto — seção 2), Objetivos (seção 3) e Justificativa (seção 4).',
    "Preencha ACESSIBILIDADE (seção 5) — obrigatória, nas três dimensões.",
    "Preencha DEMOCRATIZAÇÃO DE ACESSO (seção 6) e o Plano de Distribuição (seção 7, inclui Contrapartidas Sociais).",
    "Em Detalhes técnicos, cadastre Etapas de Trabalho (seção 8), Ficha Técnica (seção 9), Sinopse e Especificações Técnicas (seção 10).",
    'Em "Local de Realização", informe os locais (seção 13).',
    "Monte o Orçamento (seção 11): Custos por produto, Itens Orçamentários — respeite captação ≤10%/R$150k, admin ≤15%, acessibilidade ≤20%.",
    "Anexe os documentos do proponente e da proposta em PDF (Anexo II da IN).",
    "Gere o PDF, revise e clique em Enviar proposta ao MinC (segue para Análise e Enquadramento).",
    "Confira valores no Salic Comparar antes do envio para evitar cortes na análise orçamentária.",
  ];
}
