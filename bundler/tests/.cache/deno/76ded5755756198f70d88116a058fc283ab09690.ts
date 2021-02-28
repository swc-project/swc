// Loaded from https://deno.land/x/mysql/src/packets/packet.ts


import { byteFormat } from "../../deps.ts";
import { BufferReader, BufferWriter } from "../buffer.ts";
import { WriteError } from "../constant/errors.ts";
import { debug, log } from "../logger.ts";
import { PacketType } from "../../src/constant/packet.ts";

/** @ignore */
interface PacketHeader {
  size: number;
  no: number;
}

/** @ignore */
export class SendPacket {
  header: PacketHeader;

  constructor(readonly body: Uint8Array, no: number) {
    this.header = { size: body.length, no };
  }

  async send(conn: Deno.Conn) {
    const body = this.body as Uint8Array;
    const data = new BufferWriter(new Uint8Array(4 + body.length));
    data.writeUints(3, this.header.size);
    data.write(this.header.no);
    data.writeBuffer(body);
    log.debug(`send: ${data.length}B \n${byteFormat(data.buffer)}\n`);
    try {
      let wrote = 0;
      do {
        wrote += await conn.write(data.buffer.subarray(wrote));
      } while (wrote < data.length);
    } catch (error) {
      throw new WriteError(error.message);
    }
  }
}

/** @ignore */
export class ReceivePacket {
  header!: PacketHeader;
  body!: BufferReader;
  type!: PacketType;

  async parse(reader: Deno.Reader): Promise<ReceivePacket | null> {
    const header = new BufferReader(new Uint8Array(4));
    let readCount = 0;
    let nread = await this.read(reader, header.buffer);
    if (nread === null) return null;
    readCount = nread;
    const bodySize = header.readUints(3);
    this.header = {
      size: bodySize,
      no: header.readUint8(),
    };
    this.body = new BufferReader(new Uint8Array(bodySize));
    nread = await this.read(reader, this.body.buffer);
    if (nread === null) return null;
    readCount += nread;

    const { OK_Packet, ERR_Packet, EOF_Packet, Result } = PacketType;
    switch (this.body.buffer[0]) {
      case OK_Packet:
        this.type = OK_Packet;
        break;
      case 0xff:
        this.type = ERR_Packet;
        break;
      case 0xfe:
        this.type = EOF_Packet;
        break;
      default:
        this.type = Result;
        break;
    }

    debug(() => {
      const data = new Uint8Array(readCount);
      data.set(header.buffer);
      data.set(this.body.buffer, 4);
      log.debug(
        `receive: ${readCount}B, size = ${this.header.size}, no = ${this.header.no} \n${
          byteFormat(data)
        }\n`,
      );
    });

    return this;
  }

  private async read(
    reader: Deno.Reader,
    buffer: Uint8Array,
  ): Promise<number | null> {
    const size = buffer.length;
    let haveRead = 0;
    while (haveRead < size) {
      const nread = await reader.read(buffer.subarray(haveRead));
      if (nread === null) return null;
      haveRead += nread;
    }
    return haveRead;
  }
}
