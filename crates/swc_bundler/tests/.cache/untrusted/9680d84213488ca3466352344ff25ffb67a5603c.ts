// Loaded from https://raw.githubusercontent.com/deno-postgres/deno-postgres/master/utils.ts


import { createHash } from "./deps.ts";

export function readInt16BE(buffer: Uint8Array, offset: number): number {
  offset = offset >>> 0;
  const val = buffer[offset + 1] | (buffer[offset] << 8);
  return val & 0x8000 ? val | 0xffff0000 : val;
}

export function readUInt16BE(buffer: Uint8Array, offset: number): number {
  offset = offset >>> 0;
  return buffer[offset] | (buffer[offset + 1] << 8);
}

export function readInt32BE(buffer: Uint8Array, offset: number): number {
  offset = offset >>> 0;

  return (
    (buffer[offset] << 24) |
    (buffer[offset + 1] << 16) |
    (buffer[offset + 2] << 8) |
    buffer[offset + 3]
  );
}

export function readUInt32BE(buffer: Uint8Array, offset: number): number {
  offset = offset >>> 0;

  return (
    buffer[offset] * 0x1000000 +
    ((buffer[offset + 1] << 16) |
      (buffer[offset + 2] << 8) |
      buffer[offset + 3])
  );
}

const encoder = new TextEncoder();

function md5(bytes: Uint8Array): string {
  return createHash("md5").update(bytes).toString("hex");
}

// https://www.postgresql.org/docs/current/protocol-flow.html
// AuthenticationMD5Password
// The actual PasswordMessage can be computed in SQL as:
//  concat('md5', md5(concat(md5(concat(password, username)), random-salt))).
// (Keep in mind the md5() function returns its result as a hex string.)
export function hashMd5Password(
  password: string,
  username: string,
  salt: Uint8Array,
): string {
  const innerHash = md5(encoder.encode(password + username));
  const innerBytes = encoder.encode(innerHash);
  const outerBuffer = new Uint8Array(innerBytes.length + salt.length);
  outerBuffer.set(innerBytes);
  outerBuffer.set(salt, innerBytes.length);
  const outerHash = md5(outerBuffer);
  return "md5" + outerHash;
}

export interface DsnResult {
  driver: string;
  user: string;
  password: string;
  hostname: string;
  port: string;
  database: string;
  params: {
    [key: string]: string;
  };
}

export function parseDsn(dsn: string): DsnResult {
  //URL object won't parse the URL if it doesn't recognize the protocol
  //This line replaces the protocol with http and then leaves it up to URL
  const [protocol, strippedUrl] = dsn.match(/(?:(?!:\/\/).)+/g) ?? ["", ""];
  const url = new URL(`http:${strippedUrl}`);

  return {
    driver: protocol,
    user: url.username,
    password: url.password,
    hostname: url.hostname,
    port: url.port,
    // remove leading slash from path
    database: url.pathname.slice(1),
    params: Object.fromEntries(url.searchParams.entries()),
  };
}

export function isTemplateString(
  // deno-lint-ignore no-explicit-any
  template: any,
): template is TemplateStringsArray {
  if (!Array.isArray(template)) {
    return false;
  }
  return true;
}
