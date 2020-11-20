// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { deferred, Deferred, MuxAsyncIterator } from "../async/mod";
import {
    writeResponse,
    readRequest,
} from "./_io";

console.log(deferred, writeResponse, readRequest, MuxAsyncIterator)

export class ServerRequest {
    done: Deferred<Error | undefined> = deferred();
}

export class Server implements AsyncIterable<ServerRequest> {
}

export type HTTPOptions = Omit<Deno.ListenOptions, "transport">;

export function _parseAddrFromStr(addr: string): HTTPOptions {
}

export function serve(addr: string | HTTPOptions): Server {
}

export async function listenAndServe(
    addr: string | HTTPOptions,
    handler: (req: ServerRequest) => void,
): Promise<void> {
}

export type HTTPSOptions = Omit<Deno.ListenTlsOptions, "transport">;

export function serveTLS(options: HTTPSOptions): Server {
}

export async function listenAndServeTLS(
    options: HTTPSOptions,
    handler: (req: ServerRequest) => void,
): Promise<void> {
}
