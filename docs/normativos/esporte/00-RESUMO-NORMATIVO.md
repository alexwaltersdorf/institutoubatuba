# Resumo Normativo — Lei de Incentivo ao Esporte (LIE) — vigente em 2026

> Data-base: 18/07/2026. Fontes primárias em `fontes-oficiais/`. Onde o texto oficial não pôde ser lido, o item é marcado **[VERIFICAR]**.

## 0. Marco legal vigente (ATENÇÃO — mudou em 2025/2026)

| Regime ANTIGO (revogado) | Regime VIGENTE (2026) |
|---|---|
| Lei 11.438/2006 | **Lei Complementar nº 222/2025** (torna a LIE permanente) |
| Decreto 6.180/2007 | **Decreto nº 12.861/2026** |
| Portaria MESP 424/2020 | **Portaria MESP nº 10/2026** |
| manifestações: educacional / participação / rendimento | níveis: **formação esportiva / esporte para toda a vida / excelência esportiva** (art. 5º do Decreto; base art. 10 da Lei Geral do Esporte 14.597/2023) |

> ⚠️ **Transição:** em 18/07/2026 o portal "Fases do Projeto" e a interface do SLI ainda exibiam a terminologia antiga ("manifestação desportiva") e citavam a Portaria 424/2020. Os templates do sistema usam a **nova nomenclatura** com fallback documentado para a antiga.

## 1. Percentuais de dedução do IR (LC 222/2025 art. 9º; Decreto 12.861/2026 art. 3º)

| Contribuinte | 2026–2027 (transição, art. 23 LC) | A partir de 2028 |
|---|---|---|
| **Pessoa Física** | **7%** do IR devido (DAA) | 7% |
| **Pessoa Jurídica (lucro real)** | **2%** do imposto devido | **3%** |

- Projetos de **inclusão social**: limite especial de até **4%** (conjunto com Rouanet e Audiovisual). — LC 222 / Decreto art. 3º §2º.
- A **Lei 14.439/2022** (citada no briefing) é real: elevou PF 6→7% e PJ 1→2% e prorrogou a LIE até 2027 — mas hoje esses valores estão **incorporados/superados pela LC 222/2025**.

> Citação (LC 222/2025, art. 9º, §1º): *"I – relativamente à pessoa jurídica, a 3% (três por cento) do imposto devido [...]; e II – relativamente à pessoa física, a 7% (sete por cento) do imposto devido na Declaração de Ajuste Anual [...]."* — art. 23: no período de transição (até 2027) o limite da PJ é **2%**.

## 2. Limites e regras orçamentárias (Decreto 12.861/2026 — texto oficial confirmado)

| Regra | Valor | Fonte |
|---|---|---|
| Despesas administrativas (atividade-meio) | **máx. 15%** do orçamento total | art. 12 |
| Elaboração de projeto + captação de recursos | limites máximos fixados pela **Portaria 10/2026** (gradação por nível) — **[VERIFICAR]** % exato | art. 13 §5º/§6º |
| Intermediação total do objeto | **VEDADA** | art. 13 §1º |
| Aquisição de espaços publicitários com recurso incentivado | **VEDADA** | art. 14 |
| Cobrança de beneficiários (prática regular) | **VEDADA** (gratuidade) | art. 16 |
| Remuneração de atleta profissional / equipes profissionais | **VEDADA** | art. 6º; LC 222 art. 6º §2º |
| Contrapartida social — formação esportiva | **mín. 50%** de alunos da rede pública de ensino | art. 18 |
| Acessibilidade (idosos e PCD) | **obrigatória** | art. 17 |
| Teto de projetos por proponente | **máx. 6 projetos / ano-calendário** (por CNPJ-raiz) | art. 23 |
| Captação mínima | projetos que captarem **< 20%** do autorizado podem ter recursos transferidos | art. 29 §2º |
| Prestação de contas final | **60 dias** do término do projeto | art. 33 |
| Conta bancária específica | obrigatória (Banco do Brasil ou Caixa), titular = proponente | art. 30–31 |
| Sanções | multa de 2× a vantagem indevida + devolução integral corrigida | art. 34–35 |

> Citação (art. 12): *"As despesas administrativas relacionadas aos projetos ficam limitadas a 15% (quinze por cento) do orçamento total [...]"*
> Citação (art. 18): *"[...] deverão contemplar, entre os beneficiários, no mínimo, 50% (cinquenta por cento) de alunos regularmente matriculados no sistema público de ensino."*
> Citação (art. 23): *"Poderão ser apresentados, no máximo, seis projetos por proponente em cada ano-calendário."*

## 3. Tetos de captação por nível (Portaria MESP 10/2026 — fontes secundárias convergentes, **[VERIFICAR]** no DOU)

| Nível da prática esportiva | Teto de captação por projeto |
|---|---|
| Formação esportiva (inclui esporte educacional) | **sem limite pré-estabelecido** |
| Esporte para toda a vida | **R$ 2.500.000,00** |
| Excelência esportiva (alto rendimento) | **R$ 5.000.000,00** |

## 4. Documentos e campos do projeto

### Documentos obrigatórios (Decreto 12.861/2026, art. 10 — texto oficial)
1. Pedido de avaliação à Comissão Técnica, **com indicação do nível da prática esportiva**;
2. CNPJ; 3. Ato constitutivo registrado + alterações; 4. Ata de posse da diretoria; 5. CPF/RG dos responsáveis;
6. **Descrição do projeto**: (a) justificativa; (b) objetivos; (c) cronograma físico e financeiro; (d) estratégias de ação; (e) metas qualitativas e quantitativas; (f) plano de aplicação dos recursos;
7. **Orçamento analítico** + comprovação de compatibilidade com preços de mercado;
8. Capacidade técnico-operativa; 9. Funcionamento há **≥ 1 ano**.

### Campos no sistema SLI (portal "Fases do Projeto")
- **Definição**: título, objeto, período de execução.
- **Manifestação Desportiva / Nível**: desporto ou paradesporto; modalidade.
- **Destinação**: obra, evento ou atividade regular.
- **Local de execução**.
- **Público beneficiário**: tipo de pessoa, faixa etária, quantidade, PCD.
- **Dados complementares**: objetivo, metodologia, justificativa.
- **Metas**: cada meta com indicador e verificador (**mín. 2, máx. 5**).
- **Orçamento em 3 etapas**: (1) atividade-fim; (2) atividade-meio = **15%** da etapa 1; (3) elaboração + captação (% por nível).
- **Anexos**; **Finalização** (verificação de pendências).

### Fluxo SEI (assinatura)
Responsável Legal cadastra-se como **Usuário Externo no SEI Cidadania**; confirmação por e-mail a `execucao.incentivo@esporte.gov.br`. Termo de Compromisso assinado em **até 180 dias** após aprovação. Assinatura: **manuscrita física OU digital avançada (gov.br / ICP-Brasil)**; PDF pesquisável (OCR).

## 5. Calendário 2026
- Fluxo contínuo (não é edital de chamamento). Janela de apresentação **04/03 a 18/09/2026** — **[VERIFICAR]** na Portaria 10/2026.
- Prazo de análise: ~45 dias, prorrogável — **[VERIFICAR]**.

## D. Itens [VERIFICAR] (não confirmados em fonte primária)
1. **Percentuais exatos de elaboração/captação por nível** (Portaria 10/2026). Fontes divergem: (A) elaboração+gestão+captação+prest. contas somadas = 10%; (B) 10% formação / 7% esporte p/ toda a vida / 5% excelência, +15% N/NE/CO, teto absoluto R$ 100 mil. **Conferir no DOU.**
2. **Limites "prestadores 40%" e "publicidade 25%"** citados por fontes secundárias — o 25% de publicidade **conflita com o art. 14** (que veda). Provável erro de fonte secundária.
3. **Regra de transição de projetos legados** da Lei 11.438/2006 — não há dispositivo explícito na LC/Decreto; provavelmente na Portaria 10/2026.
4. **Texto integral e numeração da Portaria MESP 10/2026** — confirmar no DOU/in.gov.br (portal é SPA/JS, não extraído).
5. **Editais setoriais 2026** além da janela ordinária — confirmar no portal MESP.
