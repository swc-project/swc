import { ServerRequest } from "./server";

console.log(ServerRequest)
export function emptyReader(): Deno.Reader {
}

export function bodyReader(contentLength: number, r: BufReader): Deno.Reader {
}

export function chunkedBodyReader(h: Headers, r: BufReader): Deno.Reader {
}

export async function readTrailers(
  headers: Headers,
  r: BufReader,
): Promise<void> {
}

export async function writeChunkedBody(
  w: Deno.Writer,
  r: Deno.Reader,
): Promise<void> {
}

/** Write trailer headers to writer. It should mostly should be called after
 * `writeResponse()`. */
export async function writeTrailers(
  w: Deno.Writer,
  headers: Headers,
  trailers: Headers,
): Promise<void> {
}

export async function writeResponse(
  w: Deno.Writer,
  r: Response,
): Promise<void> {
}

/**
 * ParseHTTPVersion parses a HTTP version string.
 * "HTTP/1.0" returns (1, 0).
 * Ported from https://github.com/golang/go/blob/f5c43b9/src/net/http/request.go#L766-L792
 */
export function parseHTTPVersion(vers: string): [number, number] {
}

export async function readRequest(
  conn: Deno.Conn,
  bufr: BufReader,
): Promise<ServerRequest | null> {
}

