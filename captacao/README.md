# Sistema de Elaboração de Projetos de Captação — LIE + Rouanet/SALIC

Ferramenta de linha de comando para **elaborar projetos de captação** via leis de incentivo federais:

- **Lei de Incentivo ao Esporte (LIE)** — cadastro no **SLI** + assinatura no **SEI Cidadania** (Min. do Esporte).
- **Lei de Incentivo à Cultura (Lei Rouanet / PRONAC)** — cadastro no **SALIC** (Min. da Cultura).

O sistema (a) indexa **projetos aprovados** como referência, (b) mantém a **base normativa vigente** e (c) gera **minutas completas** no formato de cada plataforma, com **validação de conformidade** e **checklist de cadastro**, exportadas em **Markdown + DOCX**.

> Arquitetura, base normativa e como atualizar quando sair norma nova: ver **[`../CLAUDE.md`](../CLAUDE.md)** e **[`../docs/normativos/`](../docs/normativos/)**.

## Pré-requisitos

- Node ≥ 22.5 (usa o SQLite embutido, `node:sqlite`).
- `pnpm install` na raiz do repositório (uma vez).

Todos os comandos usam o script `cap` (definido no `package.json` da raiz), que já aplica a flag `--experimental-sqlite`.

## Comandos

| Comando | O que faz |
|---|---|
| `pnpm cap init` | Inicializa a base local SQLite (`captacao/data/referencia.sqlite`). |
| `pnpm cap collect --areas 2,3,6 --por-area 100 [--detalhar] [--situacao Autorizada]` | Coleta projetos aprovados do **SALIC** (API VerSALIC). `--detalhar` busca objetivos/justificativa/etc. de cada projeto (mais lento). |
| `pnpm cap import-esporte <arquivo.csv> <url-da-fonte> [--sep ";"]` | Importa uma planilha oficial de projetos aprovados da **LIE** (publicada em portaria/DOU). |
| `pnpm cap stats` | Estatísticas da base por lei e área. |
| `pnpm cap search <termos> [--lei] [--area] [--min] [--max] [--n]` | Busca projetos de referência. |
| `pnpm cap generate <briefing.json>` | Gera a minuta a partir de um briefing JSON. |
| `pnpm cap generate --lei ... --titulo ... --area ... --resumo ... --publico ... --cidade ... --valor ...` | Gera a minuta a partir de flags. |

Áreas do SALIC: `1` Artes Cênicas · `2` Audiovisual · `3` Música · `4` Artes Visuais · `5` Patrimônio · `6` Humanidades · `7` Artes Integradas · `9` Museus e Memória.

## Saída

Cada geração escreve em `captacao/output/`:
- `<lei>-<slug>.md` — minuta em Markdown.
- `<lei>-<slug>.docx` — mesma minuta em Word.

Ambas contêm: **relatório de conformidade** (erros/alertas/`[VERIFICAR]` com a fonte normativa), as **seções no formato da plataforma** (com "Onde cadastrar") e o **Checklist de cadastro** (passo a passo no SLI/SEI ou SALIC + anexos).

Exemplos já gerados estão em [`exemplos/`](./exemplos/).

## Roteiro de teste (valida o pipeline de ponta a ponta)

```bash
# 0. Instalar dependências (uma vez)
pnpm install

# 1. Rodar os testes automatizados
pnpm test                       # 15 testes do subsistema + testes do site

# 2. Inicializar a base
pnpm cap init

# 3. Coletar referências culturais (audiovisual) do SALIC
pnpm cap collect --areas 2 --por-area 20 --detalhar
pnpm cap stats

# 4. Importar o MODELO de planilha de esporte (dado fictício — substitua por planilha oficial)
pnpm cap import-esporte captacao/exemplos/modelo-import-esporte.csv \
  "https://www.gov.br/esporte/lei-de-incentivo (MODELO)" --sep ";"

# 5a. Gerar o PROJETO-EXEMPLO CULTURAL (audiovisual educativo)
pnpm cap generate captacao/briefings/exemplo-cultura.json

# 5b. Gerar o PROJETO-EXEMPLO DE ESPORTE EDUCACIONAL (formação)
pnpm cap generate captacao/briefings/exemplo-esporte.json

# 6. Conferir as saídas
ls captacao/output/
```

Resultado esperado: dois pares `.md` + `.docx` em `captacao/output/`, cada um com "Sem erros bloqueantes" no relatório de conformidade (o orçamento padrão respeita os limites vigentes) e um checklist de cadastro específico da plataforma.

## Avisos importantes

- **Minuta de trabalho:** textos entre `«...»` exigem preenchimento pelo proponente. Itens `[VERIFICAR]` dependem de confirmação em fonte oficial (ver `docs/normativos/`).
- **Nunca inventamos números normativos.** Limites confirmados estão citados por artigo; os não confirmados aparecem como `[VERIFICAR]` no template e no relatório.
- O `modelo-import-esporte.csv` contém **dado fictício** apenas para demonstrar o formato — a LIE não possui API pública consolidada; use as planilhas/portarias oficiais publicadas no DOU e no portal do Ministério do Esporte.
