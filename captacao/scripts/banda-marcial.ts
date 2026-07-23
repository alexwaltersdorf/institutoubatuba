/**
 * Gerador da minuta DETALHADA do projeto "Banda Marcial Instituto Ubatuba".
 *
 * Diferente do template genérico, este script preenche o conteúdo específico do
 * projeto (composição 40+10, orçamento real dentro dos limites da IN 29/2026,
 * apresentações, acessibilidade e democratização), reaproveitando o validador e
 * o exportador (Markdown + DOCX) do sistema.
 *
 * Rodar: pnpm cap:banda   (ou: node --import tsx captacao/scripts/banda-marcial.ts)
 */
import type {
  Minuta,
  RubricaOrcamento,
  SecaoMinuta,
  ProjetoReferencia,
} from "../src/types.ts";
import {
  validarCultura,
  consolidarOrcamentoCultura,
} from "../src/rules/cultura.ts";
import {
  reais,
  tabelaOrcamento,
  blocoReferencias,
} from "../src/templates/comum.ts";
import { exportarMinuta } from "../src/export/index.ts";

const VALOR_TOTAL = 450_000;

// Orçamento detalhado (respeita: captação ≤10% e ≤R$150k; admin ≤15%; acessibilidade ≤20%).
const orcamento: RubricaOrcamento[] = [
  {
    categoria: "producao",
    descricao:
      "Regente/maestro, instrutores de naipe (sopros, metais, percussão), instrutor de marcha e coreógrafo da linha de frente — 12 meses",
    valor: 150_000,
  },
  {
    categoria: "producao",
    descricao:
      "Aquisição e manutenção de instrumentos (sopros, metais e percussão de marcha)",
    valor: 90_000,
  },
  {
    categoria: "producao",
    descricao:
      "Uniformes do corpo musical e da linha de frente (color guard): fardamento, bandeiras, mastros e adereços",
    valor: 35_000,
  },
  {
    categoria: "producao",
    descricao:
      "Materiais e insumos: partituras/arranjos, palhetas, baquetas, óleos, cordas, peças de reposição",
    valor: 15_000,
  },
  {
    categoria: "producao",
    descricao: "Transporte e logística das apresentações públicas no município",
    valor: 12_000,
  },
  {
    categoria: "producao",
    descricao:
      "Registro e documentação das apresentações (foto/vídeo) para prestação de contas e divulgação",
    valor: 8_500,
  },
  {
    categoria: "acessibilidade",
    descricao:
      "Acessibilidade e divulgação acessível: intérprete de Libras em apresentações, materiais em formato acessível, espaços reservados",
    valor: 36_000,
  },
  {
    categoria: "administracao",
    descricao:
      "Custos de administração: coordenação executiva, contabilidade e gestão do projeto (≤15% — art. 22)",
    valor: 58_500,
  },
  {
    categoria: "captacao",
    descricao:
      "Remuneração para captação de recursos (≤10% e teto R$ 150.000 — art. 19)",
    valor: 45_000,
  },
];

// Referências reais recuperadas da base (VerSALIC) — projetos de banda/fanfarra aprovados.
const referencias: ProjetoReferencia[] = [
  ref(
    "265236",
    "Música",
    "FANFARRA DE PERCUSSÃO DE ROLÂNDIA",
    "INSTITUTO CULTURAL E DESPORTIVO DE ROLANDIA",
    172_557
  ),
  ref(
    "265057",
    "Música",
    "Música de Ribeirão",
    "BANDA DE MUSICA LIRA JOAQUIM BRAGA",
    101_098.8
  ),
  ref(
    "265093",
    "Música",
    "Novo Tom",
    "FABRICA MAKERS CULTURA E ENTRETENIMENTO LTDA",
    499_093.65
  ),
  ref(
    "264979",
    "Humanidades",
    "BANDALHEIRA – 70 ANOS DE MEMÓRIA, MÚSICA E CARNAVAL EM ITABIRITO",
    "PLENUM BRAZIL LTDA",
    675_317.5
  ),
  ref(
    "265026",
    "Música",
    "Plano Anual de Atividades Favela Brass - 2027",
    "ASSOCIACAO MUSICAL FAVELA BRASS",
    2_201_621.6
  ),
];

function ref(
  id: string,
  area: string,
  titulo: string,
  proponente: string,
  valor: number
): ProjetoReferencia {
  return {
    lei: "cultura",
    identificador: id,
    area,
    titulo,
    proponente,
    cgccpf: null,
    uf: null,
    municipio: null,
    valor_solicitado: null,
    valor_aprovado: valor,
    valor_captado: null,
    ano: null,
    situacao: "Aprovado",
    resumo: null,
    objetivos: null,
    justificativa: null,
    acessibilidade: null,
    democratizacao: null,
    ficha_tecnica: null,
    etapas: null,
    texto_completo: null,
    fonte_url: `https://api.salic.cultura.gov.br/api/v1/projetos/${id}`,
    coletado_em: null,
  };
}

const secoes: SecaoMinuta[] = [
  {
    titulo: "1. Identificação e enquadramento",
    campoPlataforma: "SALIC › Nova Proposta › Tipicidade/Tipologias",
    conteudo:
      "**Proponente:** Instituto Ubatuba (OSC sem fins lucrativos — saúde e educação)\n" +
      "**CNPJ:** «CNPJ do proponente» — **Município/UF:** Ubatuba/SP\n" +
      "**Mecanismo adotado:** Art. 26 (dedução parcial) — PF 80% doação / 60% patrocínio · PJ 40% doação / 30% patrocínio\n" +
      "**Área/segmento:** Música (banda marcial — música instrumental)\n\n" +
      "**[VERIFICAR] Possível enquadramento no art. 18 (dedução 100%):** a Lei 8.313/91 admite dedução integral para **música instrumental**. Como banda marcial é essencialmente instrumental, avaliar com o MinC o enquadramento no art. 18 (mais atrativo ao patrocinador). Esta minuta adota o art. 26 de forma conservadora.",
  },
  {
    titulo: "2. Nome e resumo da proposta (objeto)",
    campoPlataforma: "SALIC › Resumo da Proposta Cultural",
    conteudo:
      "**Nome:** Banda Marcial Instituto Ubatuba: Música, Disciplina e Cidadania\n\n" +
      "Formação e manutenção de uma **banda marcial com 50 integrantes** de Ubatuba, assim distribuídos: **40 integrantes no corpo musical** (sopros de madeira, metais e percussão de marcha) e **10 integrantes na linha de frente / color guard** (balizamento, bandeiras e coreografia). O projeto oferece, ao longo de 12 meses, formação musical teórica e prática, ensaios de naipe e de conjunto, treino de marcha e coreografia, e um calendário de **apresentações públicas gratuitas** em escolas, praças e eventos cívicos do município.",
  },
  {
    titulo: "3. Objetivos",
    campoPlataforma: "SALIC › Objetivos",
    conteudo:
      "**Objetivo geral:** formar e manter uma banda marcial de 50 integrantes em Ubatuba, promovendo educação musical de qualidade, convivência e protagonismo juvenil, com difusão cultural gratuita à população.\n\n" +
      "**Objetivos específicos:**\n" +
      "1. Oferecer formação musical continuada a 40 integrantes do corpo musical (leitura, técnica instrumental e prática de conjunto).\n" +
      "2. Formar e treinar 10 integrantes da linha de frente (color guard) em balizamento, manejo de bandeiras e coreografia.\n" +
      "3. Realizar ao menos 8 apresentações públicas gratuitas ao longo do projeto, com recursos de acessibilidade.\n" +
      "4. Fortalecer permanência escolar, disciplina e habilidades socioemocionais por meio da prática coletiva.\n" +
      "5. Garantir o acesso de pessoas com deficiência às atividades e às apresentações.",
  },
  {
    titulo: "4. Justificativa",
    campoPlataforma: "SALIC › Justificativa",
    conteudo:
      "A banda marcial é uma prática cultural coletiva de forte tradição cívica e educativa no Brasil, que articula formação artística, disciplina e pertencimento comunitário. Em Ubatuba, «apresentar diagnóstico local: oferta limitada de formação musical continuada, demanda de crianças e jovens da rede pública, ausência de banda ativa no calendário cívico do município». " +
      "A iniciativa dialoga com projetos de banda e fanfarra já aprovados na Lei Rouanet — como a *Fanfarra de Percussão de Rolândia* e a banda *Música de Ribeirão* — que comprovam a viabilidade técnica e orçamentária deste formato. O investimento em instrumentos, uniformes e equipe qualificada constitui patrimônio cultural duradouro, com impacto que se estende para além da vigência do projeto.",
  },
  {
    titulo: "5. Acessibilidade (OBRIGATÓRIA)",
    campoPlataforma: "SALIC › Acessibilidade",
    conteudo:
      "Medidas nas três dimensões exigidas (Lei 13.146/2015; art. 38 da IN 29/2026):\n" +
      "- **Arquitetônica:** apresentações em espaços com acesso a pessoas com mobilidade reduzida (rampas, espaços reservados).\n" +
      "- **Comunicacional/de conteúdo:** intérprete de Libras nas apresentações e materiais de divulgação em formato acessível; abertura de vagas na banda a pessoas com deficiência compatível com a prática.\n" +
      "- **De comunicação/divulgação acessível:** peças com descrição textual e legendas.\n\n" +
      "Custos de acessibilidade + divulgação acessível previstos: " +
      reais(36_000) +
      " (8% — dentro do teto de 20%, art. 20).",
  },
  {
    titulo: "6. Democratização de acesso",
    campoPlataforma: "SALIC › Democratização de Acesso",
    conteudo:
      "Todas as apresentações serão **gratuitas** e realizadas em espaços públicos de ampla circulação. Seleção de integrantes com **prioridade a estudantes da rede pública** e a jovens em situação de vulnerabilidade, por edital simples de inscrição. " +
      "Contrapartida social: ações formativas (oficinas abertas de percussão e sopros) para a comunidade, alcançando ≥10% do público das apresentações (mín. 20, máx. 500 beneficiários — art. 44).",
  },
  {
    titulo: "7. Plano de distribuição do produto cultural",
    campoPlataforma: "SALIC › Plano de Distribuição",
    conteudo:
      "**Produto principal:** apresentações públicas gratuitas da banda marcial (mínimo de 8 no período), em escolas, praças e eventos cívicos de Ubatuba.\n" +
      "**Produtos secundários / contrapartidas sociais:** oficinas abertas à comunidade e registro audiovisual das apresentações disponibilizado gratuitamente on-line.\n" +
      "**Forma de distribuição:** integralmente gratuita.",
  },
  {
    titulo: "8. Etapas de trabalho",
    campoPlataforma: "SALIC › Etapas de Trabalho",
    conteudo:
      "| Etapa | Descrição | Período |\n|---|---|---|\n" +
      "| Pré-produção | Seleção de integrantes, contratação da equipe, aquisição de instrumentos e uniformes, montagem do plano pedagógico | Meses 1–2 |\n" +
      "| Produção | Aulas e ensaios regulares (naipes, conjunto, marcha e linha de frente) | Meses 2–11 |\n" +
      "| Divulgação | Campanha das apresentações, peças acessíveis, assessoria | Meses 3–12 (contínuo) |\n" +
      "| Pós-produção | Apresentação de encerramento, registro, avaliação e prestação de contas | Mês 12 |",
  },
  {
    titulo: "9. Ficha técnica",
    campoPlataforma: "SALIC › Ficha Técnica",
    conteudo:
      "| Função | Qtde | Atribuição |\n|---|---|---|\n" +
      "| Regente/maestro | 1 | Direção musical e artística |\n" +
      "| Instrutor de sopros/metais | 1 | Naipes de sopro e metal |\n" +
      "| Instrutor de percussão | 1 | Naipe de percussão de marcha |\n" +
      "| Instrutor de marcha + coreógrafo(a) da linha de frente | 1 | Balizamento, bandeiras e coreografia (color guard) |\n" +
      "| Coordenação executiva e administrativa | 1 | Gestão, logística e prestação de contas |\n\n" +
      "_Anexar minicurrículos e portfólio da equipe conforme Anexo II da IN._",
  },
  {
    titulo: "10. Especificações técnicas do produto",
    campoPlataforma: "SALIC › Especificações Técnicas / Sinopse",
    conteudo:
      "**Formação:** 50 integrantes — 40 no corpo musical (madeiras, metais, percussão) e 10 na linha de frente (color guard).\n" +
      "**Repertório:** hinos cívicos, marchas, temas populares e arranjos autorais, adequados a apresentações de rua e palco.\n" +
      "**Apresentações:** duração média de 30–45 min, formato marcha e/ou estática (show band).",
  },
  {
    titulo: "11. Planilha orçamentária",
    campoPlataforma: "SALIC › Orçamento › Itens Orçamentários",
    conteudo:
      tabelaOrcamento(orcamento) +
      "\n\n_Percentuais sobre o total: produção " +
      pct(310_500) +
      ", acessibilidade " +
      pct(36_000) +
      " (≤20%), administração " +
      pct(58_500) +
      " (≤15%), captação " +
      pct(45_000) +
      " (≤10% e ≤R$150k). Compatibilize cada item com o Salic Comparar (https://aplicacoes.cultura.gov.br/comparar/)._",
  },
  {
    titulo: "12. Plano de divulgação",
    campoPlataforma:
      "SALIC › (embutido em Acessibilidade de comunicação e nos custos por produto)",
    conteudo:
      "Divulgação das apresentações em redes sociais, imprensa local e rede escolar do município, com aplicação das marcas conforme o manual da Lei Rouanet e recursos de acessibilidade (legendas e descrição textual) em todas as peças.",
  },
  {
    titulo: "13. Local de realização",
    campoPlataforma: "SALIC › Local de Realização",
    conteudo:
      "Sede de ensaios e apresentações em Ubatuba/SP: «indicar escola/espaço cultural para ensaios» e praças/escolas/eventos cívicos para as apresentações públicas.",
  },
  {
    titulo: "14. Referências (projetos aprovados similares)",
    conteudo: blocoReferencias(referencias),
  },
  {
    titulo: "Vedações a observar",
    conteudo:
      "- Difusão de imagem de agente político (art. 32, I).\n" +
      "- Proponente ligado a agente político/servidor do MinC (art. 32, II).\n" +
      "- Proselitismo ou culto religioso (art. 32, VI).\n" +
      "- Fracionamento de projetos (art. 32, VII).",
  },
];

const cons = consolidarOrcamentoCultura(orcamento);
const pend = validarCultura({
  enquadramento: "art26",
  tipoProponente: "demaisPJ",
  valorTotal: VALOR_TOTAL,
  orcamento: cons,
  temAcessibilidade: true,
  temDemocratizacao: true,
});

const minuta: Minuta = {
  lei: "cultura",
  briefing: {
    lei: "cultura",
    titulo: "Banda Marcial Instituto Ubatuba: Música, Disciplina e Cidadania",
    area: "Música",
    resumo:
      "Banda marcial com 50 integrantes (40 corpo musical + 10 linha de frente) em Ubatuba.",
    publico:
      "crianças, adolescentes e jovens de 9 a 24 anos, com prioridade à rede pública",
    cidade: "Ubatuba/SP",
    valorEstimado: VALOR_TOTAL,
  },
  secoes,
  orcamento,
  referencias,
  validacao: {
    conforme: !pend.some(p => p.severidade === "erro"),
    pendencias: pend,
  },
  checklist: [
    "Acesse o SALIC (https://salic.cultura.gov.br) e faça login (conta gov.br).",
    "Proposta › Listar → selecione o proponente (PJ/CNPJ) → Nova Proposta → aceite a Declaração de responsabilidade.",
    "Em Tipicidade/Tipologias, selecione o segmento Música. [VERIFICAR] elegibilidade ao art. 18 (música instrumental) vs. art. 26.",
    "Preencha Nome, Resumo (objeto — seção 2), Objetivos (seção 3) e Justificativa (seção 4).",
    "Preencha ACESSIBILIDADE (seção 5) — obrigatória, nas três dimensões.",
    "Preencha DEMOCRATIZAÇÃO DE ACESSO (seção 6) e o Plano de Distribuição (seção 7).",
    "Cadastre Etapas de Trabalho (seção 8), Ficha Técnica (seção 9) e Especificações Técnicas (seção 10).",
    "Informe o Local de Realização (seção 13).",
    "Monte o Orçamento (seção 11): itens de produção, acessibilidade (≤20%), administração (≤15%) e captação (≤10%/R$150k).",
    "Anexe os documentos do proponente e da proposta em PDF (Anexo II da IN).",
    "Confira os valores no Salic Comparar, gere o PDF e clique em Enviar proposta ao MinC.",
  ],
  geradoEm: new Date().toISOString(),
};

const arqs = exportarMinuta(minuta);
console.log("✅ Minuta detalhada da Banda Marcial gerada:");
console.log("   Markdown:", arqs.markdown);
console.log("   DOCX:    ", arqs.docx);
console.log(
  "   Total:",
  reais(VALOR_TOTAL),
  "| Conformidade:",
  minuta.validacao.conforme ? "sem erros bloqueantes" : "COM ERROS",
  `(${pend.length} apontamento(s))`
);

function pct(v: number): string {
  return (
    ((v / VALOR_TOTAL) * 100).toLocaleString("pt-BR", {
      maximumFractionDigits: 1,
    }) + "%"
  );
}
