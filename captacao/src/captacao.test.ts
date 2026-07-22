import { describe, it, expect } from "vitest";
import { validarEsporte } from "./rules/esporte.ts";
import { validarCultura, LIMITES_CULTURA } from "./rules/cultura.ts";
import { parseCsv } from "./collect/csv.ts";
import { parseConteudo } from "./export/blocos.ts";
import { crc32, montarZip } from "./export/zip.ts";
import { minutaParaDocxBuffer } from "./export/docx.ts";
import { gerarMinutaCultura } from "./templates/cultura.ts";
import { gerarMinutaEsporte } from "./templates/esporte.ts";
import type { BriefingProjeto } from "./types.ts";

describe("validador esporte (LIE)", () => {
  it("aponta erro quando administrativo passa de 15%", () => {
    const p = validarEsporte({
      nivel: "toda_vida",
      valorTotal: 100_000,
      orcamento: {
        atividadeFim: 60_000,
        atividadeMeio: 25_000,
        elaboracaoCaptacao: 15_000,
      },
      temAcessibilidade: true,
    });
    expect(
      p.some(x => x.severidade === "erro" && x.campo.includes("atividade_meio"))
    ).toBe(true);
  });

  it("exige acessibilidade", () => {
    const p = validarEsporte({
      nivel: "toda_vida",
      valorTotal: 100_000,
      orcamento: {
        atividadeFim: 85_000,
        atividadeMeio: 15_000,
        elaboracaoCaptacao: 0,
      },
      temAcessibilidade: false,
    });
    expect(
      p.some(x => x.campo === "acessibilidade" && x.severidade === "erro")
    ).toBe(true);
  });

  it("formação exige >=50% rede pública", () => {
    const p = validarEsporte({
      nivel: "formacao",
      valorTotal: 50_000,
      orcamento: {
        atividadeFim: 45_000,
        atividadeMeio: 5_000,
        elaboracaoCaptacao: 0,
      },
      temAcessibilidade: true,
      percentualRedePublica: 0.3,
    });
    expect(
      p.some(x => x.campo.includes("rede_publica") && x.severidade === "erro")
    ).toBe(true);
  });

  it("marca [VERIFICAR] quando elaboração+captação passa da hipótese de 10%", () => {
    const p = validarEsporte({
      nivel: "excelencia",
      valorTotal: 100_000,
      orcamento: {
        atividadeFim: 70_000,
        atividadeMeio: 10_000,
        elaboracaoCaptacao: 20_000,
      },
      temAcessibilidade: true,
    });
    expect(p.some(x => x.severidade === "verificar")).toBe(true);
  });

  it("aponta erro quando ultrapassa o teto do nível", () => {
    const p = validarEsporte({
      nivel: "toda_vida",
      valorTotal: 3_000_000,
      orcamento: {
        atividadeFim: 2_800_000,
        atividadeMeio: 200_000,
        elaboracaoCaptacao: 0,
      },
      temAcessibilidade: true,
    });
    expect(
      p.some(x => x.campo === "valor_total" && x.severidade === "erro")
    ).toBe(true);
  });
});

describe("validador cultura (Rouanet)", () => {
  it("captação acima de 10% gera erro", () => {
    const p = validarCultura({
      enquadramento: "art26",
      tipoProponente: "demaisPJ",
      valorTotal: 100_000,
      orcamento: {
        captacao: 15_000,
        acessibilidade: 10_000,
        administracao: 10_000,
      },
      temAcessibilidade: true,
      temDemocratizacao: true,
    });
    expect(
      p.some(x => x.campo === "orcamento.captacao" && x.severidade === "erro")
    ).toBe(true);
  });

  it("captação acima do teto absoluto de R$150k gera erro mesmo dentro dos 10%", () => {
    const valor = 3_000_000; // 10% = 300k > teto 150k
    const p = validarCultura({
      enquadramento: "art26",
      tipoProponente: "demaisPJ",
      valorTotal: valor,
      orcamento: { captacao: 200_000, acessibilidade: 0, administracao: 0 },
      temAcessibilidade: true,
      temDemocratizacao: true,
    });
    expect(LIMITES_CULTURA.captacaoTetoAbsoluto).toBe(150_000);
    expect(p.some(x => /150\.000/.test(x.mensagem))).toBe(true);
  });

  it("falta de acessibilidade gera erro", () => {
    const p = validarCultura({
      enquadramento: "art18",
      tipoProponente: "demaisPJ",
      valorTotal: 100_000,
      orcamento: { captacao: 0, acessibilidade: 0, administracao: 0 },
      temAcessibilidade: false,
      temDemocratizacao: true,
    });
    expect(
      p.some(x => x.campo === "acessibilidade" && x.severidade === "erro")
    ).toBe(true);
  });
});

describe("parser CSV", () => {
  it("lê aspas, separadores e escapes", () => {
    const csv = 'a,b,c\n1,"x, y","diz ""oi"""\n2,z,w';
    const linhas = parseCsv(csv);
    expect(linhas.length).toBe(3);
    expect(linhas[1][1]).toBe("x, y");
    expect(linhas[1][2]).toBe('diz "oi"');
  });
});

describe("parse de conteúdo markdown → blocos", () => {
  it("reconhece tabela, lista e parágrafo", () => {
    const md =
      "Um parágrafo.\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n- item 1\n- item 2";
    const blocos = parseConteudo(md);
    expect(blocos.some(b => b.tipo === "tabela")).toBe(true);
    expect(blocos.some(b => b.tipo === "lista")).toBe(true);
    expect(blocos.some(b => b.tipo === "paragrafo")).toBe(true);
  });
});

describe("ZIP/DOCX", () => {
  it("crc32 confere com valor conhecido", () => {
    // CRC-32 de "123456789" = 0xCBF43926
    expect(crc32(Buffer.from("123456789")).toString(16)).toBe("cbf43926");
  });

  it("monta um zip com assinatura EOCD válida", () => {
    const zip = montarZip([{ nome: "a.txt", dados: Buffer.from("hello") }]);
    // assinatura local no início
    expect(zip.readUInt32LE(0)).toBe(0x04034b50);
    // EOCD nos últimos 22 bytes
    expect(zip.readUInt32LE(zip.length - 22)).toBe(0x06054b50);
  });

  it("gera um .docx com PK e as partes OOXML", () => {
    const briefing: BriefingProjeto = {
      lei: "cultura",
      area: "Audiovisual",
      titulo: "Teste",
      resumo: "Resumo.",
      publico: "jovens",
      cidade: "Ubatuba/SP",
      valorEstimado: 200_000,
    };
    const m = gerarMinutaCultura(briefing, []);
    const buf = minutaParaDocxBuffer(m);
    expect(buf.subarray(0, 2).toString()).toBe("PK");
    expect(buf.includes(Buffer.from("word/document.xml"))).toBe(true);
    expect(buf.includes(Buffer.from("[Content_Types].xml"))).toBe(true);
  });
});

describe("geração de minuta", () => {
  it("esporte formação: minuta conforme e com seções esperadas", () => {
    const briefing: BriefingProjeto = {
      lei: "esporte",
      area: "esporte educacional (formação)",
      titulo: "Esporte na Escola",
      resumo: "Aulas de futsal e natação para crianças.",
      publico: "crianças de 6 a 12 anos",
      cidade: "Ubatuba/SP",
      valorEstimado: 300_000,
    };
    const m = gerarMinutaEsporte(briefing, []);
    expect(m.validacao.conforme).toBe(true);
    expect(m.secoes.some(s => s.titulo.includes("Planilha orçamentária"))).toBe(
      true
    );
    expect(m.checklist.length).toBeGreaterThan(5);
  });

  it("cultura: orçamento default respeita limites (sem erros de orçamento)", () => {
    const briefing: BriefingProjeto = {
      lei: "cultura",
      area: "Audiovisual",
      titulo: "Doc Educativo",
      resumo: "Documentário educativo sobre o litoral norte.",
      publico: "estudantes",
      cidade: "Ubatuba/SP",
      valorEstimado: 400_000,
      proponente: { nome: "Instituto", cnpj: "00.000.000/0001-00" },
    };
    const m = gerarMinutaCultura(briefing, []);
    const errosOrcamento = m.validacao.pendencias.filter(
      p => p.severidade === "erro" && p.campo.startsWith("orcamento")
    );
    expect(errosOrcamento.length).toBe(0);
  });
});
