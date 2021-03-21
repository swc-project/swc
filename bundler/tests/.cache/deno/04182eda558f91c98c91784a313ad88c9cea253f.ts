// Loaded from https://deno.land/x/mongo@v0.20.0/src/collection/collection.ts


import { Bson } from "../../deps.ts";
import { WireProtocol } from "../protocol/mod.ts";
import {
  CountOptions,
  DeleteOptions,
  DistinctOptions,
  Document,
  DropOptions,
  FindOptions,
  InsertOptions,
  UpdateOptions,
} from "../types.ts";
import { FindCursor } from "./commands/find.ts";
import { AggregateCursor } from "./commands/aggregate.ts";
import { update } from "./commands/update.ts";

export class Collection<T> {
  #protocol: WireProtocol;
  #dbName: string;

  constructor(protocol: WireProtocol, dbName: string, readonly name: string) {
    this.#protocol = protocol;
    this.#dbName = dbName;
  }

  find(filter?: Document, options?: FindOptions): FindCursor<T> {
    return new FindCursor<T>({
      filter,
      protocol: this.#protocol,
      collectionName: this.name,
      dbName: this.#dbName,
      options: options ?? {},
    });
  }

  async findOne(
    filter?: Document,
    options?: FindOptions,
  ): Promise<T | undefined> {
    const cursor = this.find(filter, options);
    return await cursor.next();
  }

  async count(filter?: Document, options?: CountOptions): Promise<number> {
    const res = await this.#protocol.commandSingle(this.#dbName, {
      count: this.name,
      query: filter,
      ...options,
    });
    const { n, ok } = res;
    if (ok === 1) {
      return n;
    } else {
      return 0;
    }
  }

  async insertOne(doc: Document, options?: InsertOptions) {
    const { insertedIds } = await this.insertMany([doc], options);
    return insertedIds[0];
  }

  async insert(docs: Document | Document[], options?: InsertOptions) {
    docs = Array.isArray(docs) ? docs : [docs];
    return this.insertMany(docs as Document[], options);
  }

  async insertMany(
    docs: Document[],
    options?: InsertOptions,
  ): Promise<{ insertedIds: Document[]; insertedCount: number }> {
    const insertedIds = docs.map((doc) => {
      if (!doc._id) {
        doc._id = new Bson.ObjectID();
      }
      return doc._id;
    });
    const res = await this.#protocol.commandSingle(this.#dbName, {
      insert: this.name,
      documents: docs,
      ordered: options?.ordered ?? true,
      writeConcern: options?.writeConcern,
      bypassDocumentValidation: options?.bypassDocumentValidation,
      comment: options?.comment,
    });
    const { writeErrors } = res;
    if (writeErrors) {
      const [{ errmsg }] = writeErrors;
      throw new Error(errmsg);
    }
    return {
      insertedIds,
      insertedCount: res.n,
    };
  }

  async updateOne(filter: Document, update: Document, options?: UpdateOptions) {
    const {
      upsertedIds = [],
      upsertedCount,
      matchedCount,
      modifiedCount,
    } = await this.updateMany(filter, update, {
      ...options,
      multi: false,
    });
    return {
      upsertedId: upsertedIds ? upsertedIds[0] : undefined,
      upsertedCount,
      matchedCount,
      modifiedCount,
    };
  }

  async updateMany(filter: Document, doc: Document, options?: UpdateOptions) {
    return await update(this.#protocol, this.#dbName, this.name, filter, doc, {
      ...options,
      multi: options?.multi ?? true,
    });
  }

  async deleteMany(filter: Document, options?: DeleteOptions): Promise<number> {
    const res = await this.#protocol.commandSingle(this.#dbName, {
      delete: this.name,
      deletes: [
        {
          q: filter,
          limit: options?.limit ?? 0,
          collation: options?.collation,
          hint: options?.hint,
          comment: options?.comment,
        },
      ],
      ordered: options?.ordered ?? true,
      writeConcern: options?.writeConcern,
    });
    return res.n;
  }

  delete = this.deleteMany;

  async deleteOne(filter: Document, options?: DeleteOptions) {
    return this.delete(filter, { ...options, limit: 1 });
  }

  async drop(options?: DropOptions): Promise<void> {
    const res = await this.#protocol.commandSingle(this.#dbName, {
      drop: this.name,
      ...options,
    });
  }

  async distinct(key: string, query?: Document, options?: DistinctOptions) {
    const { values } = await this.#protocol.commandSingle(this.#dbName, {
      distinct: this.name,
      key,
      query,
      ...options,
    });
    return values;
  }

  aggregate(pipeline: Document[], options?: any): AggregateCursor<T> {
    return new AggregateCursor<T>({
      pipeline,
      protocol: this.#protocol,
      dbName: this.#dbName,
      collectionName: this.name,
      options,
    });
  }
}
