/**
 * Escritor de arquivos ZIP sem dependências (método "store", sem compressão).
 * Suficiente para empacotar as partes OOXML de um .docx. Usa apenas Buffer/Node.
 */

const CRC_TABLE: number[] = (() => {
  const t: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++)
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export interface EntradaZip {
  nome: string;
  dados: Buffer;
}

/** Monta um Buffer ZIP a partir das entradas (método store). Datas fixas (determinístico). */
export function montarZip(entradas: EntradaZip[]): Buffer {
  const locais: Buffer[] = [];
  const centrais: Buffer[] = [];
  let offset = 0;

  for (const e of entradas) {
    const nomeBuf = Buffer.from(e.nome, "utf8");
    const crc = crc32(e.dados);
    const tam = e.dados.length;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // assinatura
    local.writeUInt16LE(20, 4); // versão necessária
    local.writeUInt16LE(0x0800, 6); // flag UTF-8
    local.writeUInt16LE(0, 8); // método store
    local.writeUInt16LE(0, 10); // hora
    local.writeUInt16LE(0x21, 12); // data (1980-01-01)
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(tam, 18); // comprimido
    local.writeUInt32LE(tam, 22); // descomprimido
    local.writeUInt16LE(nomeBuf.length, 26);
    local.writeUInt16LE(0, 28); // extra
    locais.push(local, nomeBuf, e.dados);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4); // versão que criou
    central.writeUInt16LE(20, 6); // versão necessária
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0x21, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(tam, 20);
    central.writeUInt32LE(tam, 24);
    central.writeUInt16LE(nomeBuf.length, 28);
    central.writeUInt16LE(0, 30); // extra
    central.writeUInt16LE(0, 32); // comentário
    central.writeUInt16LE(0, 34); // disco
    central.writeUInt16LE(0, 36); // attrs internos
    central.writeUInt32LE(0, 38); // attrs externos
    central.writeUInt32LE(offset, 42); // offset do header local
    centrais.push(central, nomeBuf);

    offset += local.length + nomeBuf.length + e.dados.length;
  }

  const corpoLocal = Buffer.concat(locais);
  const corpoCentral = Buffer.concat(centrais);
  const fim = Buffer.alloc(22);
  fim.writeUInt32LE(0x06054b50, 0);
  fim.writeUInt16LE(0, 4); // nº do disco
  fim.writeUInt16LE(0, 6); // disco do diretório central
  fim.writeUInt16LE(entradas.length, 8);
  fim.writeUInt16LE(entradas.length, 10);
  fim.writeUInt32LE(corpoCentral.length, 12);
  fim.writeUInt32LE(corpoLocal.length, 16); // offset do diretório central
  fim.writeUInt16LE(0, 20); // comentário

  return Buffer.concat([corpoLocal, corpoCentral, fim]);
}
