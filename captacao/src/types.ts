/**
 * Tipos de domínio do sistema de elaboração de projetos de captação.
 *
 * Duas leis / plataformas:
 *  - 'esporte' → Lei de Incentivo ao Esporte (LIE), cadastro via SLI + SEI Cidadania
 *  - 'cultura' → Lei de Incentivo à Cultura (Lei Rouanet / PRONAC), cadastro via SALIC
 *
 * Referências normativas: ver docs/normativos/{esporte,cultura}/00-RESUMO-NORMATIVO.md
 */

export type Lei = "esporte" | "cultura";

/** Marca campos cujo valor normativo não pôde ser confirmado em fonte primária. */
export const VERIFICAR = "[VERIFICAR]" as const;

// ---------------------------------------------------------------------------
// Base de projetos aprovados (referência) — schema comum às duas leis
// ---------------------------------------------------------------------------

export interface ProjetoReferencia {
  id?: number;
  lei: Lei;
  /** PRONAC (cultura) ou nº de processo/portaria (esporte). */
  identificador: string;
  /** Área/segmento (cultura) ou manifestação/nível (esporte). */
  area: string | null;
  titulo: string;
  proponente: string | null;
  cgccpf: string | null;
  uf: string | null;
  municipio: string | null;
  valor_solicitado: number | null;
  valor_aprovado: number | null;
  valor_captado: number | null;
  ano: number | null;
  situacao: string | null;
  resumo: string | null;
  objetivos: string | null;
  justificativa: string | null;
  acessibilidade: string | null;
  democratizacao: string | null;
  ficha_tecnica: string | null;
  etapas: string | null;
  /** Concatenação dos campos textuais, para busca por palavra-chave. */
  texto_completo: string | null;
  fonte_url: string | null;
  coletado_em: string | null;
}

// ---------------------------------------------------------------------------
// Entrada do usuário para gerar um projeto novo
// ---------------------------------------------------------------------------

export interface BriefingProjeto {
  lei: Lei;
  /** Código/nome da área (cultura) ou nível/manifestação (esporte). */
  area: string;
  /** Título do projeto. */
  titulo: string;
  /** Resumo livre da ideia. */
  resumo: string;
  /** Público-alvo (texto livre). */
  publico: string;
  /** Cidade/UF de execução. Ex.: "Ubatuba/SP". */
  cidade: string;
  /** Valor total estimado do projeto, em reais. */
  valorEstimado: number;
  /** Dados do proponente (opcional; usa padrão do Instituto se ausente). */
  proponente?: DadosProponente;
  /** Nº de projetos de referência a recuperar (default 4). */
  nRefs?: number;
}

export interface DadosProponente {
  nome: string;
  cnpj?: string;
  natureza?: string; // ex.: "Organização da sociedade civil (OSC) sem fins lucrativos"
  cidade?: string;
  uf?: string;
  responsavelLegal?: string;
}

// ---------------------------------------------------------------------------
// Orçamento
// ---------------------------------------------------------------------------

export interface RubricaOrcamento {
  /** Etapa/rubrica: 'atividade_fim' | 'atividade_meio' | 'elaboracao_captacao' | 'acessibilidade' | 'administracao' | ... */
  categoria: string;
  descricao: string;
  valor: number;
}

// ---------------------------------------------------------------------------
// Validação de conformidade
// ---------------------------------------------------------------------------

export type Severidade = "erro" | "alerta" | "verificar" | "ok";

export interface Pendencia {
  severidade: Severidade;
  campo: string;
  mensagem: string;
  /** Referência normativa (artigo + arquivo). */
  fonte?: string;
}

export interface ResultadoValidacao {
  conforme: boolean;
  pendencias: Pendencia[];
}

// ---------------------------------------------------------------------------
// Minuta gerada
// ---------------------------------------------------------------------------

export interface SecaoMinuta {
  /** Rótulo do campo tal como aparece no formulário da plataforma. */
  titulo: string;
  /** Conteúdo em texto/markdown. */
  conteudo: string;
  /** Campo do formulário SLI/SALIC onde este bloco deve ser colado. */
  campoPlataforma?: string;
}

export interface Minuta {
  lei: Lei;
  briefing: BriefingProjeto;
  secoes: SecaoMinuta[];
  orcamento: RubricaOrcamento[];
  referencias: ProjetoReferencia[];
  validacao: ResultadoValidacao;
  /** Passo a passo de onde colar cada bloco na plataforma + anexos. */
  checklist: string[];
  geradoEm: string;
}
