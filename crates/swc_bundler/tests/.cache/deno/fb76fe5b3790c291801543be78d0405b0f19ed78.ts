// Loaded from https://deno.land/x/mysql/src/auth_plugin/caching_sha2_password.ts


import { xor } from "../util.ts";
import { ReceivePacket } from "../packets/packet.ts";
import { encryptWithPublicKey } from "./crypt.ts";

interface handler {
  done: boolean;
  quickRead?: boolean;
  next?: (packet: ReceivePacket) => any;
  data?: Uint8Array;
}

let scramble: Uint8Array, password: string;
function start(scramble_: Uint8Array, password_: string): handler {
  scramble = scramble_;
  password = password_;
  return { done: false, next: authMoreResponse };
}
function authMoreResponse(packet: ReceivePacket): handler {
  const enum AuthStatusFlags {
    FullAuth = 0x04,
    FastPath = 0x03,
  }
  const REQUEST_PUBLIC_KEY = 0x02;
  const statusFlag = packet.body.skip(1).readUint8();
  let authMoreData, done = true, next, quickRead = false;
  if (statusFlag === AuthStatusFlags.FullAuth) {
    authMoreData = new Uint8Array([REQUEST_PUBLIC_KEY]);
    done = false;
    next = encryptWithKey;
  }
  if (statusFlag === AuthStatusFlags.FastPath) {
    done = false;
    quickRead = true;
    next = terminate;
  }
  return { done, next, quickRead, data: authMoreData };
}

function encryptWithKey(packet: ReceivePacket): handler {
  const publicKey = parsePublicKey(packet);
  const len = password.length;
  let passwordBuffer: Uint8Array = new Uint8Array(len + 1);
  for (let n = 0; n < len; n++) {
    passwordBuffer[n] = password.charCodeAt(n);
  }
  passwordBuffer[len] = 0x00;

  const encryptedPassword = encrypt(passwordBuffer, scramble, publicKey);
  return { done: false, next: terminate, data: encryptedPassword };
}

function parsePublicKey(packet: ReceivePacket): string {
  return packet.body.skip(1).readNullTerminatedString();
}
function encrypt(
  password: Uint8Array,
  scramble: Uint8Array,
  key: string,
): Uint8Array {
  const stage1 = xor(password, scramble);
  const encrypted = encryptWithPublicKey(key, stage1);
  return encrypted;
}

function terminate() {
  return { done: true };
}

export { start };
