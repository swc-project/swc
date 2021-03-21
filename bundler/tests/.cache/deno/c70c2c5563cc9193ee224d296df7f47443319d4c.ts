// Loaded from https://deno.land/x/mongo@v0.20.0/src/protocol/handshake.ts


import { WireProtocol } from "./protocol.ts";

export const driverMetadata = {
  driver: {
    name: "Deno Mongo",
    version: "v0.0.1",
  },
  os: {
    type: Deno.build.os,
    name: Deno.build.os,
    architecture: Deno.build.arch,
  },
};

interface HandshakeResponse {
  ismaster: string;
  maxBsonObjectSize: number;
  maxMessageSizeBytes: number;
  maxWriteBatchSize: number;
  localTime: Date;
  logicalSessionTimeoutMinutes: number;
  connectionId: number;
  minWireVersion: number;
  maxWireVersion: number;
  readOnly: boolean;
  ok: number;
}

export async function handshake(
  protocol: WireProtocol,
): Promise<HandshakeResponse> {
  const reply = await protocol.commandSingle<HandshakeResponse>("admin", {
    isMaster: true,
    client: driverMetadata,
  });
  return reply;
}
