# FONTES NORMATIVAS — Sistema de Elaboração de Projetos de Captação

> Registro de proveniência de todos os normativos usados pelo sistema.
> **Regra de ouro:** o documento oficial baixado vence a memória do modelo. Sempre citar arquivo + trecho.
> Data-base desta pesquisa: **18–19/07/2026**. Reverificar antes de cada ciclo de elaboração (normativos de leis de incentivo mudam com frequência).

## Como reverificar / atualizar
Rodar novamente a pesquisa (ver `CLAUDE.md` › "Como atualizar a base normativa"). Ao sair norma nova:
1. Baixar o texto oficial para a pasta `fontes-oficiais/` da lei correspondente.
2. Atualizar o `00-RESUMO-NORMATIVO.md` da lei, citando artigo e trecho.
3. Atualizar os limites em `captacao/src/rules/` (validadores) e registrar a mudança aqui.

---

## LEI DE INCENTIVO AO ESPORTE (LIE) — cadastro via SLI + SEI Cidadania (Ministério do Esporte)

> ⚠️ **MUDANÇA DE MARCO LEGAL EM 2025/2026.** A Lei 11.438/2006 e o Decreto 6.180/2007 (citados no briefing original) foram **REVOGADOS**. O regime vigente é LC 222/2025 + Decreto 12.861/2026 + Portaria MESP 10/2026.

| Documento | Situação | URL oficial | Acesso | Arquivo local |
|---|---|---|---|---|
| **Lei Complementar nº 222, de 26/11/2025** | **VIGENTE** — torna a LIE permanente; revoga a Lei 11.438/2006 | https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp222.htm | 18/07/2026 | `esporte/fontes-oficiais/LC-222-2025.txt` |
| **Decreto nº 12.861, de 27/02/2026** | **VIGENTE** — regulamenta a LC 222/2025; revoga o Decreto 6.180/2007 (art. 41) | https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d12861.htm | 18/07/2026 | `esporte/fontes-oficiais/Decreto-12861-2026.txt` |
| **Portaria MESP nº 10, de 03/03/2026** | **VIGENTE** — regulamento operacional (cadastro, análise, tetos, prestação de contas) | in.gov.br / gov.br/esporte (portal SPA — texto integral não capturado) | 18/07/2026 | `[VERIFICAR]` — ver `esporte/00-RESUMO-NORMATIVO.md` §D |
| **Lei nº 14.439, de 24/08/2022** | Histórica — alterou a Lei 11.438 (PF 6→7%, PJ 1→2%); superada pela LC 222 | referida em l11438.htm | 18/07/2026 | (no texto da Lei 11.438) |
| **Lei nº 11.438, de 29/12/2006** | **REVOGADA** pela LC 222/2025 (mantida como referência histórica) | https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11438.htm | 18/07/2026 | `esporte/fontes-oficiais/Lei-11438-2006-REVOGADA.txt` |
| **Decreto nº 6.180, de 03/08/2007** | **REVOGADO** pelo Decreto 12.861/2026 | (revogado) | 18/07/2026 | — |
| Portal LIE / MESP | Referência operacional | https://www.gov.br/esporte/pt-br/acoes-e-programas/lei-de-incentivo-ao-esporte | 18/07/2026 | — |
| Portal "Fases do Projeto" (campos SLI) | ⚠️ ainda cita Portaria 424/2020 (em transição) | https://www.gov.br/esporte/pt-br/acoes-e-programas/lei-de-incentivo-ao-esporte/fases-do-projeto-2 | 18/07/2026 | `esporte/fontes-oficiais/portal-fases-do-projeto.txt` |
| SLI — Sistema da Lei de Incentivo | Cadastro de proponente/projeto | https://sli.mds.gov.br/ | 18/07/2026 | — |
| SEI Cidadania | Assinatura de Termo de Compromisso | (cadastro de usuário externo; `execucao.incentivo@esporte.gov.br`) | 18/07/2026 | — |

---

## LEI DE INCENTIVO À CULTURA (Lei Rouanet / PRONAC) — cadastro via SALIC (Ministério da Cultura)

> ⚠️ **Correções ao briefing original:** o Decreto vigente é o **11.453/2023** (revogou o Decreto 10.755/2021 citado no briefing). A IN vigente é a **nº 29/2026** (não uma IN anterior). A obrigatoriedade de acessibilidade nasce da **Lei 13.146/2015** (LBI), não de uma IN de 2018.

| Documento | Situação | URL oficial | Acesso | Arquivo local |
|---|---|---|---|---|
| **Lei nº 8.313, de 23/12/1991** (Rouanet / PRONAC) | **VIGENTE** (texto compilado; alt. Lei 14.568/2023) | https://www.planalto.gov.br/ccivil_03/leis/l8313cons.htm | 18/07/2026 | `cultura/fontes-oficiais/Lei-8313-1991.html` |
| **Decreto nº 11.453, de 23/03/2023** | **VIGENTE** — revoga o Decreto 10.755/2021 (art. 82) | https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11453.htm | 18/07/2026 | `cultura/fontes-oficiais/Decreto-11453-2023.html` |
| **Instrução Normativa MinC nº 29, de 29/01/2026** | **VIGENTE** — DOU 30/01/2026, Ed. 21, Seç. 1, p. 22; regulamenta "Incentivo a Projetos Culturais" | https://www.gov.br/cultura/pt-br/acesso-a-informacao/legislacao-e-normativas/instrucao-normativa-minc-no-29-de-29-de-janeiro-de-2026 | 18/07/2026 | `cultura/fontes-oficiais/IN-MinC-29-2026.html` |
| **Lei nº 13.146/2015** (LBI) | **VIGENTE** — §3º ao art. 2º da Lei 8.313 (origem da acessibilidade obrigatória) | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm | 18/07/2026 | — |
| **Manual do Proponente — Módulo I** | Publicado (referencia IN 23/2025 — `[VERIFICAR]` versão IN 29/2026) | https://www.gov.br/cultura/.../MANUALDOPROPONENTEMdulo1...IN2025.pdf | 18/07/2026 | `cultura/fontes-oficiais/Manual-Proponente-Modulo1.txt` |
| **VerSALIC / SALIC-API** (pública) | **LIVE** — base `/api/v1`; 58.923 projetos | https://api.salic.cultura.gov.br/api/v1/ — docs https://api.salic.cultura.gov.br/docs | 18/07/2026 | endpoints em `cultura/00-RESUMO-NORMATIVO.md` §D |
| **Salic Comparar** (valores médios por item) | Referência de custos praticados (não é "tabela oficial" única) | https://aplicacoes.cultura.gov.br/comparar/ | 18/07/2026 | `[VERIFICAR]` §E |
| Portal Lei Rouanet | Referência operacional + Anexos I–IV | https://www.gov.br/lei-rouanet | 18/07/2026 | — |
| SALIC (cadastro) | Cadastro de proposta | https://salic.cultura.gov.br | 18/07/2026 | — |

---

## Itens pendentes de confirmação (consolidado — ver detalhe nos resumos por lei)
- **[VERIFICAR]** Texto integral da **Portaria MESP nº 10/2026** (percentuais de elaboração/captação por nível; regra de transição de projetos legados). Fontes secundárias divergem — ver `esporte/00-RESUMO-NORMATIVO.md`.
- **[VERIFICAR]** Existência de "tabela de valores de referência" federal única do MinC (o instrumento de fato é o Salic Comparar).
- **[VERIFICAR]** Versão do Manual do Proponente SALIC atualizada para a IN 29/2026.
