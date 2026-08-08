# Apoio ao cadastro no SALIC — Banda Marcial Instituto Ubatuba

Quatro formas de levar a minuta ao formulário do SALIC (salic.cultura.gov.br),
da mais simples à mais automatizada. Em todas: **salvar como rascunho, nunca
clicar em "Enviar proposta ao MinC"** sem revisão prévia.

| Arquivo | Como usar |
|---|---|
| `salic-cola-preenchimento-banda-marcial.txt` | Cola em texto puro: 16 blocos na ordem das telas, com o campo de destino indicado. Copiar e colar manualmente. |
| `salic-preenchimento-banda-marcial.html` | Mesma cola em página com botões "Copiar" por bloco. Abrir no navegador ao lado do SALIC. |
| `salic_fill.py` | Preenchedor assistido (Playwright, roda **no computador do usuário**): abre o Chrome, o usuário loga no gov.br, o script digita cada bloco no campo focado. `pip install playwright && playwright install chromium && python salic_fill.py` |
| `PROMPT-CLAUDE-NAVEGADOR-SALIC.txt` | Prompt pronto para a Claude com controle de navegador (extensão Claude in Chrome): com o SALIC logado, colar o prompt e ela preenche as abas. |

Por que não dá para preencher direto do servidor: o SALIC bloqueia IPs de
datacenter (desafio Cloudflare, verificado em 30/07/2026 — HTTP 403) e o login
gov.br é pessoal, com verificação em duas etapas. A autenticação é sempre do
responsável legal.

Estes arquivos são gerados a partir da minuta em
`captacao/exemplos/cultura-banda-marcial-*.md` (fonte:
`captacao/scripts/banda-marcial.ts`, `pnpm cap:banda`). Se a minuta mudar,
regenere a cola e derivados.
