# CLAUDE.md — Sistema de Elaboração de Projetos de Captação (LIE + Rouanet/SALIC)

Este repositório contém **dois projetos**:

1. **Site do Instituto Ubatuba** (raiz: `client/`, `server/`, `shared/`) — app Express + tRPC + React + Drizzle/MySQL.
2. **Sistema de Elaboração de Projetos de Captação** (`captacao/`) — subsistema **autocontido** que pesquisa projetos aprovados, mantém a base normativa e gera minutas de projetos para captação via leis de incentivo federais. **Não depende do site** e não altera seu comportamento.

Este arquivo documenta o subsistema `captacao/`.

---

## 1. Objetivo

Elaborar projetos de captação para duas plataformas:

- **Lei de Incentivo ao Esporte (LIE)** → cadastro no **SLI** + assinatura no **SEI Cidadania** (Ministério do Esporte).
- **Lei de Incentivo à Cultura (Lei Rouanet / PRONAC)** → cadastro no **SALIC** (Ministério da Cultura).

Faz: (a) indexa projetos aprovados como referência; (b) mantém base normativa vigente; (c) gera minutas completas no formato exato de cada plataforma, com validação de conformidade e checklist de cadastro.

## 2. Arquitetura

```
captacao/
  src/
    types.ts              Tipos de domínio (Lei, BriefingProjeto, Minuta, Pendencia...)
    db/db.ts              Base local SQLite (node:sqlite, sem deps nativas)
    collect/
      versalic.ts         Coletor da API pública VerSALIC (cultura)
      csv.ts              Parser CSV puro (sem deps)
      esporte.ts          Importador de CSV de projetos aprovados da LIE
    search/search.ts      Busca por palavra-chave + filtros; recupera 3–5 referências similares
    rules/
      esporte.ts          Limites + validador da LIE (LC 222/2025, Decreto 12.861/2026)
      cultura.ts          Limites + validador da Rouanet (IN MinC 29/2026)
    templates/
      esporte.ts          Gera minuta LIE (campos do SLI)
      cultura.ts          Gera minuta SALIC (abas do SALIC)
      comum.ts            Utilidades (formatação, proponente padrão, tabelas)
    generate/generate.ts  Fluxo: recupera referências → gera minuta → valida
    export/
      markdown.ts         Minuta → Markdown
      blocos.ts           Minuta → modelo de blocos (parse de tabelas/listas)
      zip.ts              Escritor ZIP sem dependências (para o .docx)
      docx.ts             Minuta → .docx (OOXML) sem dependências
      index.ts            Escreve os arquivos em captacao/output/
    cli.ts                CLI (init, collect, import-esporte, stats, search, generate)
    captacao.test.ts      Testes (validadores, CSV, DOCX/ZIP, geração)
  data/                   Base SQLite + planilhas importadas (ignorado pelo git)
  output/                 Minutas geradas (ignorado pelo git)
  exemplos/               Minutas de exemplo commitadas (referência do formato)
  briefings/              Briefings JSON de exemplo
docs/normativos/          Base normativa (ver seção 4)
```

**Decisões técnicas:**
- **SQLite embutido** (`node:sqlite`) — zero dependências nativas; exige a flag `--experimental-sqlite` (já no script `cap`).
- **DOCX sem dependências** — gerador OOXML próprio (`export/docx.ts` + `export/zip.ts`), para não acoplar libs pesadas ao repositório do site.
- **CLI** (não UI web) — o subsistema é operado por linha de comando, independente do deploy do site.

## 3. Como usar

Pré-requisito: `pnpm install` (uma vez). Node ≥ 22.5 (para `node:sqlite`).

```bash
pnpm cap init                       # inicializa a base local
pnpm cap collect --areas 2,3,6 --por-area 100 --detalhar   # coleta SALIC (cultura)
pnpm cap import-esporte <arquivo.csv> <url-da-fonte> --sep ;   # importa lista LIE
pnpm cap stats                      # estatísticas da base
pnpm cap search documentário educativo --lei cultura        # busca referências
pnpm cap generate captacao/briefings/exemplo-cultura.json   # gera por JSON
pnpm cap generate --lei esporte --titulo "..." --area "..." --resumo "..." \
                  --publico "..." --cidade "Ubatuba/SP" --valor 300000     # gera por flags
```

Saídas em `captacao/output/`: `<lei>-<slug>.md` e `<lei>-<slug>.docx`, cada uma com relatório de conformidade e "Checklist de cadastro".

## 4. Base normativa e regra de ouro

A base normativa vigente está em `docs/normativos/`:
- `FONTES.md` — proveniência (URL, data de acesso, versão) de cada documento.
- `esporte/00-RESUMO-NORMATIVO.md` e `cultura/00-RESUMO-NORMATIVO.md` — limites com citação de artigo.
- `{esporte,cultura}/fontes-oficiais/` — textos oficiais baixados do Planalto/gov.br.

**Regra de ouro:** o documento oficial baixado vence a memória do modelo. Sempre citar arquivo + trecho. **Nunca inventar** número de portaria/IN ou valor de limite: se não confirmar na fonte, marcar `[VERIFICAR]` e listar no relatório.

Marco legal vigente (2026), **conferido em 18/07/2026 por fontes oficiais**:
- **LIE:** LC nº 222/2025 + Decreto nº 12.861/2026 + Portaria MESP nº 10/2026. ⚠️ A Lei 11.438/2006 e o Decreto 6.180/2007 estão **revogados**.
- **Rouanet:** Lei nº 8.313/1991 + Decreto nº 11.453/2023 + IN MinC nº 29/2026. (O Decreto 10.755/2021 está revogado.)

Itens ainda `[VERIFICAR]`: percentuais de elaboração/captação por nível da Portaria MESP 10/2026; existência de tabela de valores de referência federal única do MinC; versão do Manual do Proponente SALIC para a IN 29/2026.

## 5. Como atualizar a base quando sair norma nova

1. **Confirme na fonte oficial** (não na memória): baixe o texto do Planalto/gov.br/DOU para `docs/normativos/<lei>/fontes-oficiais/`.
2. Atualize o `00-RESUMO-NORMATIVO.md` da lei, citando artigo + trecho, e registre a mudança em `docs/normativos/FONTES.md` (URL + data de acesso + versão).
3. Ajuste os limites nos validadores: `captacao/src/rules/esporte.ts` ou `captacao/src/rules/cultura.ts` (constantes `LIMITES_*`, `TETOS_*`, `NIVEIS_*`).
4. Atualize/adicione testes em `captacao/src/captacao.test.ts` e rode `pnpm test`.
5. Se um item `[VERIFICAR]` foi confirmado, remova a marcação e fixe o número no validador e no template.

## 6. Contexto do proponente

Os exemplos assumem o **Instituto Ubatuba** (OSC de saúde e educação, litoral norte de SP). O padrão do proponente está em `captacao/src/templates/comum.ts` (`PROPONENTE_PADRAO`), mas os templates são **genéricos e reutilizáveis** — passe `proponente` no briefing JSON para sobrescrever.

## 7. Testes

`pnpm test` (vitest) cobre validadores de conformidade das duas leis, parser CSV, integridade ZIP/DOCX e geração de minuta. Os testes de `captacao/` não tocam `node:sqlite` (o parser CSV é isolado em `collect/csv.ts`), então rodam no ambiente padrão do vitest.
