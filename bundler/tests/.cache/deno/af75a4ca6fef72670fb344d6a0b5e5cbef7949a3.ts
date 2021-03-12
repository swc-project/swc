// Loaded from https://deno.land/x/mongo@v0.20.0/src/client.ts


import { assert } from "../deps.ts";
import { Database } from "./database.ts";
import { WireProtocol } from "./protocol/mod.ts";
import { ConnectOptions, Document, ListDatabaseInfo } from "./types.ts";
import { parse } from "./utils/uri.ts";

export class MongoClient {
  #protocol?: WireProtocol;
  #conn?: Deno.Conn;

  async connect(options: ConnectOptions | string) {
    let hostname = "127.0.0.1",
      port = 27017;
    if (typeof options === "string") {
      const opt = parse(options);
      hostname = opt.servers[0].host;
      port = opt.servers[0].port;
    }

    const conn = await Deno.connect({
      hostname,
      port,
    });
    this.#conn = conn;
    this.#protocol = new WireProtocol(conn);

    await this.#protocol.connect();
  }

  async listDatabases(options?: {
    filter?: Document;
    nameOnly?: boolean;
    authorizedCollections?: boolean;
    comment?: Document;
  }): Promise<ListDatabaseInfo[]> {
    assert(this.#protocol);
    if (!options) {
      options = {};
    }
    const { databases } = await this.#protocol.commandSingle("admin", {
      listDatabases: 1,
      ...options,
    });
    return databases;
  }

  database(name: string): Database {
    assert(this.#protocol);
    return new Database(this.#protocol, name);
  }

  close() {
    if (this.#conn) {
      Deno.close(this.#conn.rid);
      this.#conn = undefined;
      this.#protocol = undefined;
    }
  }
}
