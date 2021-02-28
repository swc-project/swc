// Loaded from https://deno.land/x/mysql/src/packets/parsers/handshake.ts


import { BufferReader, BufferWriter } from "../../buffer.ts";
import ServerCapabilities from "../../constant/capabilities.ts";
import { PacketType } from "../../constant/packet.ts";
import { ReceivePacket } from "../packet.ts";

/** @ignore */
export interface HandshakeBody {
  protocolVersion: number;
  serverVersion: string;
  threadId: number;
  seed: Uint8Array;
  serverCapabilities: number;
  characterSet: number;
  statusFlags: number;
  authPluginName: string;
}

/** @ignore */
export function parseHandshake(reader: BufferReader): HandshakeBody {
  const protocolVersion = reader.readUint8();
  const serverVersion = reader.readNullTerminatedString();
  const threadId = reader.readUint32();
  const seedWriter = new BufferWriter(new Uint8Array(20));
  seedWriter.writeBuffer(reader.readBuffer(8));
  reader.skip(1);
  let serverCapabilities = reader.readUint16();

  let characterSet: number = 0,
    statusFlags: number = 0,
    authPluginDataLength: number = 0,
    authPluginName: string = "";

  if (!reader.finished) {
    characterSet = reader.readUint8();
    statusFlags = reader.readUint16();
    serverCapabilities |= reader.readUint16() << 16;

    if ((serverCapabilities & ServerCapabilities.CLIENT_PLUGIN_AUTH) != 0) {
      authPluginDataLength = reader.readUint8();
    } else {
      reader.skip(1);
    }
    reader.skip(10);

    if (
      (serverCapabilities & ServerCapabilities.CLIENT_SECURE_CONNECTION) !=
        0
    ) {
      seedWriter.writeBuffer(
        reader.readBuffer(Math.max(13, authPluginDataLength - 8)),
      );
    }

    if ((serverCapabilities & ServerCapabilities.CLIENT_PLUGIN_AUTH) != 0) {
      authPluginName = reader.readNullTerminatedString();
    }
  }

  return {
    protocolVersion,
    serverVersion,
    threadId,
    seed: seedWriter.buffer,
    serverCapabilities,
    characterSet,
    statusFlags,
    authPluginName,
  };
}

export enum AuthResult {
  AuthPassed,
  MethodMismatch,
  AuthMoreRequired,
}
export function parseAuth(packet: ReceivePacket): AuthResult {
  switch (packet.type) {
    case PacketType.EOF_Packet:
      return AuthResult.MethodMismatch;
    case PacketType.Result:
      return AuthResult.AuthMoreRequired;
    case PacketType.OK_Packet:
      return AuthResult.AuthPassed;
    default:
      return AuthResult.AuthPassed;
  }
}
