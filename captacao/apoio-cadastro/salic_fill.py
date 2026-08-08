#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Preenchedor assistido do SALIC — Projeto "Banda Marcial Instituto Ubatuba"
==========================================================================

RODE ESTE SCRIPT NO SEU COMPUTADOR (não em servidor): ele abre um Chrome
visível, VOCÊ faz o login gov.br normalmente (com o 2FA no seu celular),
e depois o script digita cada bloco do projeto no campo que você clicar.

Por que assim? O SALIC bloqueia robôs (Cloudflare) e o login gov.br é
pessoal e intransferível. Este script NÃO burla nada: ele só digita por
você, dentro da SUA sessão autenticada — como um "colador" automático.

INSTALAÇÃO (uma vez, no terminal do seu computador):
    pip install playwright
    playwright install chromium

USO:
    python salic_fill.py

FLUXO:
    1. Abre o Chrome no site do SALIC.
    2. Você faz login (gov.br) e navega: Proposta > Listar > Nova Proposta.
    3. No terminal, aparece o menu com os 16 blocos do projeto.
    4. Digite o número do bloco, clique no campo correspondente no Chrome
       (você tem 5 segundos) e o script digita o texto no campo focado.
    5. Repita para cada campo. Ao final: SALVE COMO RASCUNHO.

SEGURANÇA:
    - O script NUNCA clica em nada — só digita texto no campo que VOCÊ focou.
    - Ele NÃO envia a proposta ao MinC. O envio é decisão sua, manual,
      e ficou combinado que só ocorre após consulta.
    - Nenhuma senha passa pelo script.
"""

import sys
import time

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit(
        "Playwright não instalado.\n"
        "Rode:  pip install playwright  &&  playwright install chromium"
    )

SALIC_URL = "https://salic.cultura.gov.br"
SEGUNDOS_PARA_FOCAR = 5

BLOCOS = [
  {
    "secao": "1. Identificação e enquadramento",
    "campo": "SALIC › Nova Proposta › Tipicidade/Tipologias",
    "texto": "Proponente: Instituto Ubatuba (OSC sem fins lucrativos — saúde e educação)\nCNPJ: «CNPJ do proponente» — Município/UF: Ubatuba/SP\nMecanismo adotado: Art. 26 (dedução parcial) — PF 80% doação / 60% patrocínio · PJ 40% doação / 30% patrocínio\nÁrea/segmento: Música (banda marcial — música instrumental)\n\n[VERIFICAR] Possível enquadramento no art. 18 (dedução 100%): a Lei 8.313/91 admite dedução integral para música instrumental. Como banda marcial é essencialmente instrumental, avaliar com o MinC o enquadramento no art. 18 (mais atrativo ao patrocinador). Esta minuta adota o art. 26 de forma conservadora."
  },
  {
    "secao": "2. Nome e resumo da proposta (objeto)",
    "campo": "SALIC › Resumo da Proposta Cultural",
    "texto": "Nome: Banda Marcial Instituto Ubatuba: Música, Disciplina e Cidadania\n\nFormação e manutenção de uma banda marcial com 50 integrantes de Ubatuba, assim distribuídos: 40 integrantes no corpo musical (sopros de madeira, metais e percussão de marcha) e 10 integrantes na linha de frente / color guard (balizamento, bandeiras e coreografia). O projeto oferece, ao longo de 12 meses, formação musical teórica e prática, ensaios de naipe e de conjunto, treino de marcha e coreografia, e um calendário de apresentações públicas gratuitas em escolas, praças e eventos cívicos do município."
  },
  {
    "secao": "3. Objetivos",
    "campo": "SALIC › Objetivos",
    "texto": "Objetivo geral: formar e manter uma banda marcial de 50 integrantes em Ubatuba, promovendo educação musical de qualidade, convivência e protagonismo juvenil, com difusão cultural gratuita à população.\n\nObjetivos específicos:\n1. Oferecer formação musical continuada a 40 integrantes do corpo musical (leitura, técnica instrumental e prática de conjunto).\n2. Formar e treinar 10 integrantes da linha de frente (color guard) em balizamento, manejo de bandeiras e coreografia.\n3. Realizar ao menos 8 apresentações públicas gratuitas ao longo do projeto, com recursos de acessibilidade.\n4. Fortalecer permanência escolar, disciplina e habilidades socioemocionais por meio da prática coletiva.\n5. Garantir o acesso de pessoas com deficiência às atividades e às apresentações."
  },
  {
    "secao": "4. Justificativa",
    "campo": "SALIC › Justificativa",
    "texto": "A banda marcial é uma prática cultural coletiva de forte tradição cívica e educativa no Brasil, que articula formação artística, disciplina e pertencimento comunitário. Em Ubatuba, «apresentar diagnóstico local: oferta limitada de formação musical continuada, demanda de crianças e jovens da rede pública, ausência de banda ativa no calendário cívico do município». A iniciativa dialoga com projetos de banda e fanfarra já aprovados na Lei Rouanet — como a *Fanfarra de Percussão de Rolândia* e a banda *Música de Ribeirão* — que comprovam a viabilidade técnica e orçamentária deste formato. O investimento em instrumentos, uniformes e equipe qualificada constitui patrimônio cultural duradouro, com impacto que se estende para além da vigência do projeto."
  },
  {
    "secao": "5. Acessibilidade (OBRIGATÓRIA)",
    "campo": "SALIC › Acessibilidade",
    "texto": "Medidas nas três dimensões exigidas (Lei 13.146/2015; art. 38 da IN 29/2026):\n- Arquitetônica: apresentações em espaços com acesso a pessoas com mobilidade reduzida (rampas, espaços reservados).\n- Comunicacional/de conteúdo: intérprete de Libras nas apresentações e materiais de divulgação em formato acessível; abertura de vagas na banda a pessoas com deficiência compatível com a prática.\n- De comunicação/divulgação acessível: peças com descrição textual e legendas.\n\nCustos de acessibilidade + divulgação acessível previstos: R$ 36.000,00 (8% — dentro do teto de 20%, art. 20)."
  },
  {
    "secao": "6. Democratização de acesso",
    "campo": "SALIC › Democratização de Acesso",
    "texto": "Todas as apresentações serão gratuitas e realizadas em espaços públicos de ampla circulação. Seleção de integrantes com prioridade a estudantes da rede pública e a jovens em situação de vulnerabilidade, por edital simples de inscrição. Contrapartida social: ações formativas (oficinas abertas de percussão e sopros) para a comunidade, alcançando ≥10% do público das apresentações (mín. 20, máx. 500 beneficiários — art. 44)."
  },
  {
    "secao": "7. Plano de distribuição do produto cultural",
    "campo": "SALIC › Plano de Distribuição",
    "texto": "Produto principal: apresentações públicas gratuitas da banda marcial (mínimo de 8 no período), em escolas, praças e eventos cívicos de Ubatuba.\nProdutos secundários / contrapartidas sociais: oficinas abertas à comunidade e registro audiovisual das apresentações disponibilizado gratuitamente on-line.\nForma de distribuição: integralmente gratuita."
  },
  {
    "secao": "8. Etapas de trabalho",
    "campo": "SALIC › Etapas de Trabalho",
    "texto": "| Etapa | Descrição | Período |\n|---|---|---|\n| Pré-produção | Seleção de integrantes, contratação da equipe, aquisição de instrumentos e uniformes, montagem do plano pedagógico | Meses 1–2 |\n| Produção | Aulas e ensaios regulares (naipes, conjunto, marcha e linha de frente) | Meses 2–11 |\n| Divulgação | Campanha das apresentações, peças acessíveis, assessoria | Meses 3–12 (contínuo) |\n| Pós-produção | Apresentação de encerramento, registro, avaliação e prestação de contas | Mês 12 |"
  },
  {
    "secao": "9. Ficha técnica",
    "campo": "SALIC › Ficha Técnica",
    "texto": "| Função | Qtde | Atribuição |\n|---|---|---|\n| Regente/maestro | 1 | Direção musical e artística |\n| Instrutor de sopros/metais | 1 | Naipes de sopro e metal |\n| Instrutor de percussão | 1 | Naipe de percussão de marcha |\n| Instrutor de marcha + coreógrafo(a) da linha de frente | 1 | Balizamento, bandeiras e coreografia (color guard) |\n| Coordenação executiva e administrativa | 1 | Gestão, logística e prestação de contas |\n\nAnexar minicurrículos e portfólio da equipe conforme Anexo II da IN."
  },
  {
    "secao": "10. Especificações técnicas do produto",
    "campo": "SALIC › Especificações Técnicas / Sinopse",
    "texto": "Formação: 50 integrantes — 40 no corpo musical (madeiras, metais, percussão) e 10 na linha de frente (color guard).\nRepertório: hinos cívicos, marchas, temas populares e arranjos autorais, adequados a apresentações de rua e palco.\nApresentações: duração média de 30–45 min, formato marcha e/ou estática (show band)."
  },
  {
    "secao": "11. Planilha orçamentária",
    "campo": "SALIC › Orçamento › Itens Orçamentários",
    "texto": "| Etapa/Rubrica | Descrição | Valor | % |\n|---|---|---:|---:|\n| producao | Regente/maestro, instrutores de naipe (sopros, metais, percussão), instrutor de marcha e coreógrafo da linha de frente — 12 meses | R$ 150.000,00 | 33,3% |\n| producao | Aquisição e manutenção de instrumentos (sopros, metais e percussão de marcha) | R$ 90.000,00 | 20% |\n| producao | Uniformes do corpo musical e da linha de frente (color guard): fardamento, bandeiras, mastros e adereços | R$ 35.000,00 | 7,8% |\n| producao | Materiais e insumos: partituras/arranjos, palhetas, baquetas, óleos, cordas, peças de reposição | R$ 15.000,00 | 3,3% |\n| producao | Transporte e logística das apresentações públicas no município | R$ 12.000,00 | 2,7% |\n| producao | Registro e documentação das apresentações (foto/vídeo) para prestação de contas e divulgação | R$ 8.500,00 | 1,9% |\n| acessibilidade | Acessibilidade e divulgação acessível: intérprete de Libras em apresentações, materiais em formato acessível, espaços reservados | R$ 36.000,00 | 8% |\n| administracao | Custos de administração: coordenação executiva, contabilidade e gestão do projeto (≤15% — art. 22) | R$ 58.500,00 | 13% |\n| captacao | Remuneração para captação de recursos (≤10% e teto R$ 150.000 — art. 19) | R$ 45.000,00 | 10% |\n| TOTAL | | R$ 450.000,00 | 100% |\n\nPercentuais sobre o total: produção 69%, acessibilidade 8% (≤20%), administração 13% (≤15%), captação 10% (≤10% e ≤R$150k). Compatibilize cada item com o Salic Comparar (https://aplicacoes.cultura.gov.br/comparar/)."
  },
  {
    "secao": "12. Plano de divulgação",
    "campo": "SALIC › (embutido em Acessibilidade de comunicação e nos custos por produto)",
    "texto": "Divulgação das apresentações em redes sociais, imprensa local e rede escolar do município, com aplicação das marcas conforme o manual da Lei Rouanet e recursos de acessibilidade (legendas e descrição textual) em todas as peças."
  },
  {
    "secao": "13. Local de realização",
    "campo": "SALIC › Local de Realização",
    "texto": "Sede de ensaios e apresentações em Ubatuba/SP: «indicar escola/espaço cultural para ensaios» e praças/escolas/eventos cívicos para as apresentações públicas."
  },
  {
    "secao": "14. Referências (projetos aprovados similares)",
    "campo": "(seção de apoio — não é campo do formulário)",
    "texto": "- FANFARRA DE PERCUSSÃO DE ROLÂNDIA [Música] (265236) — aprovado: R$ 172.557,00 — INSTITUTO CULTURAL E DESPORTIVO DE ROLANDIA\n- Música de Ribeirão [Música] (265057) — aprovado: R$ 101.098,80 — BANDA DE MUSICA LIRA JOAQUIM BRAGA\n- Novo Tom [Música] (265093) — aprovado: R$ 499.093,65 — FABRICA MAKERS CULTURA E ENTRETENIMENTO LTDA\n- BANDALHEIRA – 70 ANOS DE MEMÓRIA, MÚSICA E CARNAVAL EM ITABIRITO [Humanidades] (264979) — aprovado: R$ 675.317,50 — PLENUM BRAZIL LTDA\n- Plano Anual de Atividades Favela Brass - 2027 [Música] (265026) — aprovado: R$ 2.201.621,60 — ASSOCIACAO MUSICAL FAVELA BRASS"
  },
  {
    "secao": "Vedações a observar",
    "campo": "(seção de apoio — não é campo do formulário)",
    "texto": "- Difusão de imagem de agente político (art. 32, I).\n- Proponente ligado a agente político/servidor do MinC (art. 32, II).\n- Proselitismo ou culto religioso (art. 32, VI).\n- Fracionamento de projetos (art. 32, VII)."
  },
  {
    "secao": "Checklist de cadastro (passo a passo)",
    "campo": "(seção de apoio — não é campo do formulário)",
    "texto": "1. Acesse o SALIC (https://salic.cultura.gov.br) e faça login (conta gov.br).\n2. Proposta › Listar → selecione o proponente (PJ/CNPJ) → Nova Proposta → aceite a Declaração de responsabilidade.\n3. Em Tipicidade/Tipologias, selecione o segmento Música. [VERIFICAR] elegibilidade ao art. 18 (música instrumental) vs. art. 26.\n4. Preencha Nome, Resumo (objeto — seção 2), Objetivos (seção 3) e Justificativa (seção 4).\n5. Preencha ACESSIBILIDADE (seção 5) — obrigatória, nas três dimensões.\n6. Preencha DEMOCRATIZAÇÃO DE ACESSO (seção 6) e o Plano de Distribuição (seção 7).\n7. Cadastre Etapas de Trabalho (seção 8), Ficha Técnica (seção 9) e Especificações Técnicas (seção 10).\n8. Informe o Local de Realização (seção 13).\n9. Monte o Orçamento (seção 11): itens de produção, acessibilidade (≤20%), administração (≤15%) e captação (≤10%/R$150k).\n10. Anexe os documentos do proponente e da proposta em PDF (Anexo II da IN).\n11. Confira os valores no Salic Comparar, gere o PDF e clique em Enviar proposta ao MinC."
  }
]


def menu() -> None:
    print("\n" + "=" * 64)
    print("BLOCOS DO PROJETO (digite o número para preencher):")
    print("=" * 64)
    for i, b in enumerate(BLOCOS, 1):
        print(f"  {i:2d}. {b['secao']}")
        print(f"      -> {b['campo']}")
    print("   v. Ver texto de um bloco antes de digitar (ex.: v3)")
    print("   q. Sair")


def main() -> None:
    print(__doc__)
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(SALIC_URL)
        print(">>> Chrome aberto no SALIC.")
        print(">>> Faça login com gov.br e abra: Proposta > Listar > Nova Proposta.")
        input(">>> Quando a proposta estiver aberta, aperte ENTER aqui... ")

        while True:
            menu()
            escolha = input("\nBloco nº (ou v<n>, q): ").strip().lower()
            if escolha == "q":
                break
            if escolha.startswith("v") and escolha[1:].isdigit():
                i = int(escolha[1:])
                if 1 <= i <= len(BLOCOS):
                    b = BLOCOS[i - 1]
                    print("\n" + "-" * 64)
                    print(f"[{b['secao']}]  ->  {b['campo']}\n")
                    print(b["texto"])
                    print("-" * 64)
                continue
            if not escolha.isdigit() or not (1 <= int(escolha) <= len(BLOCOS)):
                print("Opção inválida.")
                continue

            b = BLOCOS[int(escolha) - 1]
            print(f"\n>>> Bloco: {b['secao']}")
            print(f">>> Campo no SALIC: {b['campo']}")
            print(f">>> CLIQUE AGORA no campo correspondente no Chrome!")
            for s in range(SEGUNDOS_PARA_FOCAR, 0, -1):
                print(f"    digitando em {s}...", end="\r", flush=True)
                time.sleep(1)
            try:
                # insert_text digita no elemento focado, sem clicar em nada.
                page.keyboard.insert_text(b["texto"])
                print("\n>>> Texto digitado. Confira no navegador.            ")
            except Exception as e:
                print(f"\n>>> Falhou: {e}")
                print(">>> A página mudou? Foque o campo e tente de novo.")

        print("\nLembrete final: SALVAR COMO RASCUNHO e gerar o PDF.")
        print("NÃO clique em 'Enviar proposta ao MinC' antes da revisão combinada.")
        input("Aperte ENTER para fechar o navegador... ")
        browser.close()


if __name__ == "__main__":
    main()
