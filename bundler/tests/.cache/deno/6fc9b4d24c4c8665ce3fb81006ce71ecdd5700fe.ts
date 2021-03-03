// Loaded from https://deno.land/x/mongo@v0.20.0/src/protocol/cursor.ts


import { Bson } from "../../deps.ts";
import { WireProtocol } from "./protocol.ts";
import { Document } from "../types.ts";
import { parseNamespace } from "../utils/ns.ts";

export interface CommandCursorOptions<T> {
  id: bigint | number | string;
  ns: string;
  firstBatch: T[];
  maxTimeMS?: number;
  comment?: Document;
}

export class CommandCursor<T> {
  #id?: bigint;
  #protocol: WireProtocol;
  #batches: T[] = [];
  #db?: string;
  #collection?: string;

  #executor: () => Promise<CommandCursorOptions<T>>;
  #excuted: boolean = false;

  constructor(
    protocol: WireProtocol,
    executor: () => Promise<CommandCursorOptions<T>>,
  ) {
    this.#protocol = protocol;
    this.#executor = executor;
  }

  private async execute() {
    this.#excuted = true;
    const options = await this.#executor();
    this.#batches = options.firstBatch;
    this.#id = BigInt(options.id);
    const { db, collection } = parseNamespace(options.ns);
    this.#db = db;
    this.#collection = collection;
  }

  async next(): Promise<T | undefined> {
    if (this.#batches.length > 0) {
      return this.#batches.shift();
    }

    if (this.#excuted === false) {
      await this.execute();
      return this.#batches.shift();
    }

    if (this.#id === 0n) {
      return undefined;
    }

    const { cursor } = await this.#protocol.commandSingle(this.#db!, {
      getMore: Bson.Long.fromBigInt(this.#id!),
      collection: this.#collection,
    });
    this.#batches = cursor.nextBatch || [];
    this.#id = BigInt(cursor.id.toString());
    return this.#batches.shift();
  }

  async *[Symbol.asyncIterator]() {
    while (this.#batches.length > 0 || this.#id !== 0n) {
      yield await this.next();
    }
  }

  async forEach(callback: (item: T, index: number) => void) {
    let index = 0;
    for await (const item of this) {
      if (item) {
        callback(item, index++);
      }
    }
  }

  async map<M>(callback: (item: T, index: number) => M): Promise<M[]> {
    let index = 0;
    let result = [];
    for await (const item of this) {
      if (item) {
        const newItem = callback(item, index++);
        result.push(newItem);
      }
    }
    return result;
  }

  async toArray(): Promise<T[]> {
    return this.map((item) => item);
  }
}
