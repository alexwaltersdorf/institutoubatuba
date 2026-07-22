/**
 * Gerador de .docx sem dependências externas.
 * Converte a Minuta em OOXML (WordprocessingML) e empacota com o escritor ZIP local.
 * Suporta títulos, parágrafos com **negrito**, listas "- " e tabelas markdown "| a | b |".
 */
import type { Minuta } from "../types.ts";
import { montarZip, type EntradaZip } from "./zip.ts";
import { minutaParaBlocos, type Bloco } from "./blocos.ts";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Renderiza runs com suporte a **negrito** inline. */
function runsInline(texto: string): string {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g).filter(p => p !== "");
  return partes
    .map(p => {
      const negrito = /^\*\*[^*]+\*\*$/.test(p);
      const t = negrito ? p.slice(2, -2) : p;
      const rpr = negrito ? "<w:rPr><w:b/></w:rPr>" : "";
      return `<w:r>${rpr}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
    })
    .join("");
}

function paragrafo(texto: string, estilo?: string): string {
  const ppr = estilo ? `<w:pPr><w:pStyle w:val="${estilo}"/></w:pPr>` : "";
  return `<w:p>${ppr}${runsInline(texto)}</w:p>`;
}

function itemLista(texto: string): string {
  return `<w:p><w:pPr><w:pStyle w:val="ListaMarc"/></w:pPr>${runsInline(texto)}</w:p>`;
}

const BORDA = `<w:tblBorders>
<w:top w:val="single" w:sz="4" w:space="0" w:color="999999"/>
<w:left w:val="single" w:sz="4" w:space="0" w:color="999999"/>
<w:bottom w:val="single" w:sz="4" w:space="0" w:color="999999"/>
<w:right w:val="single" w:sz="4" w:space="0" w:color="999999"/>
<w:insideH w:val="single" w:sz="4" w:space="0" w:color="999999"/>
<w:insideV w:val="single" w:sz="4" w:space="0" w:color="999999"/>
</w:tblBorders>`;

function tabela(linhas: string[][], temCabecalho: boolean): string {
  const nCols = Math.max(...linhas.map(l => l.length));
  const linhaXml = (celulas: string[], cabecalho: boolean) => {
    const tcs: string[] = [];
    for (let i = 0; i < nCols; i++) {
      const txt = celulas[i] ?? "";
      const shd = cabecalho
        ? '<w:shd w:val="clear" w:color="auto" w:fill="EFEFEF"/>'
        : "";
      tcs.push(
        `<w:tc><w:tcPr>${shd}</w:tcPr>${paragrafo(cabecalho ? `**${txt}**` : txt)}</w:tc>`
      );
    }
    return `<w:tr>${tcs.join("")}</w:tr>`;
  };
  const trs = linhas
    .map((l, i) => linhaXml(l, temCabecalho && i === 0))
    .join("");
  return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/>${BORDA}</w:tblPr>${trs}</w:tbl>`;
}

function blocoParaXml(b: Bloco): string {
  switch (b.tipo) {
    case "titulo":
      return paragrafo(
        b.texto,
        b.nivel === 0 ? "Titulo" : `Heading${Math.min(b.nivel, 3)}`
      );
    case "paragrafo":
      return paragrafo(b.texto);
    case "lista":
      return b.itens.map(itemLista).join("");
    case "tabela":
      return tabela(b.linhas, b.temCabecalho);
  }
}

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:styleId="Normal" w:default="1"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Titulo"><w:name w:val="Title"/><w:pPr><w:spacing w:after="240"/></w:pPr><w:rPr><w:b/><w:sz w:val="40"/><w:color w:val="1F4E79"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="120"/></w:pPr><w:rPr><w:b/><w:sz w:val="30"/><w:color w:val="1F4E79"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:pPr><w:keepNext/><w:spacing w:before="160" w:after="80"/></w:pPr><w:rPr><w:b/><w:sz w:val="26"/><w:color w:val="2E74B5"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:pPr><w:keepNext/><w:spacing w:before="120" w:after="60"/></w:pPr><w:rPr><w:b/><w:sz w:val="24"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="ListaMarc"><w:name w:val="List Bullet"/><w:pPr><w:numPr><w:numId w:val="0"/></w:numPr><w:ind w:left="360"/></w:pPr></w:style>
</w:styles>`;

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const DOC_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

export function minutaParaDocxBuffer(m: Minuta): Buffer {
  const blocos = minutaParaBlocos(m);
  const corpo = blocos.map(blocoParaXml).join("");
  const documento = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${corpo}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body>
</w:document>`;

  const entradas: EntradaZip[] = [
    { nome: "[Content_Types].xml", dados: Buffer.from(CONTENT_TYPES, "utf8") },
    { nome: "_rels/.rels", dados: Buffer.from(RELS, "utf8") },
    { nome: "word/document.xml", dados: Buffer.from(documento, "utf8") },
    { nome: "word/styles.xml", dados: Buffer.from(STYLES, "utf8") },
    {
      nome: "word/_rels/document.xml.rels",
      dados: Buffer.from(DOC_RELS, "utf8"),
    },
  ];
  return montarZip(entradas);
}
