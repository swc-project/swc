// Loaded from https://deno.land/x/mongo@v0.20.0/src/protocol/message.ts


import { MessageHeader, OpCode, serializeHeader } from "./header.ts";
import { Document } from "../types.ts";
import { deserializeBson, serializeBson } from "../utils/bson.ts";

type MessageFlags = number;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

interface Section0 {
  document: Document;
}

interface Section1 {
  identifier: string;
  documents: Document[];
}

export type Section = Section0 | Section1;

export interface Message {
  responseTo: number;
  flags?: MessageFlags;
  sections: Section[];
  checksum?: number;
  requestId: number;
}

function serializeSections(
  sections: Section[],
): { length: number; sections: Uint8Array[] } {
  let totalLen = 0;
  const buffers = sections.map((section) => {
    if ("document" in section) {
      const document = serializeBson(section.document);
      const section0 = new Uint8Array(1 + document.byteLength);
      new DataView(section0.buffer).setUint8(0, 0);
      section0.set(document, 1);
      totalLen += section0.byteLength;
      return section0;
    } else {
      const identifier = encoder.encode(section.identifier + "\0");
      let documentsLength = 0;
      let docs = section.documents.map((doc) => {
        const document = serializeBson(doc);
        documentsLength += document.byteLength;
        return document;
      });
      const section1 = new Uint8Array(
        1 + 4 + identifier.byteLength + documentsLength,
      );
      const view = new DataView(section1.buffer);

      view.setUint8(0, 1);
      view.setUint32(1, section1.byteLength - 1, true);
      let pos = 4;

      for (const doc of docs) {
        section1.set(doc, pos);
        pos += doc.byteLength;
      }

      totalLen += section1.byteLength;
      return section1;
    }
  });

  return { length: totalLen, sections: buffers };
}

export function serializeMessage(message: Message): Uint8Array[] {
  const { length, sections } = serializeSections(message.sections);
  const buffer = new Uint8Array(4 + length);

  const view = new DataView(buffer.buffer);
  view.setInt32(0, message.flags ?? 0, true);

  let pos = 4;
  sections.forEach((section) => {
    buffer.set(section, pos);
    pos += section.byteLength;
  });

  const header = serializeHeader({
    messageLength: 16 + buffer.byteLength,
    responseTo: message.responseTo,
    requestId: message.requestId,
    opCode: OpCode.MSG,
  });

  return [header, buffer];
}

export function deserializeMessage(
  header: MessageHeader,
  buffer: Uint8Array,
): Message {
  const view = new DataView(buffer.buffer);

  const flags = view.getInt32(0);
  const sections: Section[] = [];

  let pos = 4;
  while (pos < view.byteLength) {
    const kind = view.getInt8(pos);
    pos++;
    if (kind === 0) {
      const docLen = view.getInt32(pos, true);
      const document = deserializeBson(
        new Uint8Array(view.buffer.slice(pos, pos + docLen)),
      );
      pos += docLen;
      sections.push({ document });
    } else if (kind === 1) {
      console.log("kind1");
      const len = view.getInt32(pos, true);
      const sectionBody = new Uint8Array(
        view.buffer.slice(pos + 4, pos + len - 4),
      );
      const identifierEndPos = sectionBody.findIndex((byte) => byte === 0);
      const identifier = decoder.decode(buffer.slice(0, identifierEndPos));
      const docsBuffer = sectionBody.slice(identifierEndPos + 1);
      const documents = parseDocuments(docsBuffer);
      pos += len;
      sections.push({ identifier, documents });
    } else {
      throw new Error("Invalid section kind: " + kind);
    }
  }

  return {
    responseTo: header.responseTo,
    requestId: header.requestId,
    flags,
    sections,
  };
}

function parseDocuments(buffer: Uint8Array): Document[] {
  let pos = 0;
  const docs = [];
  const view = new DataView(buffer);
  while (pos < buffer.byteLength) {
    const docLen = view.getInt32(pos, true);
    const doc = deserializeBson(buffer.slice(pos, pos + docLen));
    docs.push(doc);
    pos += docLen;
  }
  return docs;
}
