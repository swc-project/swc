// Loaded from https://deno.land/x/denodb@v1.0.18/lib/database.ts


import type { Connector } from "./connectors/connector.ts";
import type {
  FieldMatchingTable,
  Model,
  ModelFields,
  ModelSchema,
} from "./model.ts";
import { QueryBuilder, QueryDescription } from "./query-builder.ts";
import {
  PostgresConnector,
  PostgresOptions,
} from "./connectors/postgres-connector.ts";
import {
  SQLite3Connector,
  SQLite3Options,
} from "./connectors/sqlite3-connector.ts";
import { MySQLConnector, MySQLOptions } from "./connectors/mysql-connector.ts";
import {
  MongoDBConnector,
  MongoDBOptions,
} from "./connectors/mongodb-connector.ts";
import { formatResultToModelInstance } from "./helpers/results.ts";
import { Translator } from "./translators/translator.ts";
import { SQLTranslator } from "./translators/sql-translator.ts";

type DatabaseOptions =
  | DatabaseDialect
  | {
    dialect: DatabaseDialect;
    debug?: boolean;
  };

export type SyncOptions = {
  /** If tables should be dropped if they exist. */
  drop?: boolean;
};

export type DatabaseDialect = "postgres" | "sqlite3" | "mysql" | "mongo";

/** Database client which interacts with an external database instance. */
export class Database {
  private _dialect: DatabaseDialect;
  private _connector: Connector;
  private _queryBuilder: QueryBuilder;
  private _models: ModelSchema[] = [];
  private _debug: boolean;

  /** Initialize database given a dialect and options.
   *
   *     const db = new Database("sqlite3", {
   *       filepath: "./db.sqlite"
   *     });
   *
   *     const db = new Database({
   *       dialect: "sqlite3",
   *       debug: true
   *     }, { ... });
   */
  constructor(
    databaseOptionsOrDialect: DatabaseOptions,
    connectionOptions:
      | PostgresOptions
      | SQLite3Options
      | MySQLOptions
      | MongoDBOptions,
  ) {
    this._dialect = typeof databaseOptionsOrDialect === "object"
      ? databaseOptionsOrDialect.dialect
      : databaseOptionsOrDialect;

    this._debug = typeof databaseOptionsOrDialect === "object"
      ? databaseOptionsOrDialect.debug ?? false
      : false;

    this._queryBuilder = new QueryBuilder();

    switch (this._dialect) {
      case "postgres":
        this._connector = new PostgresConnector(
          connectionOptions as PostgresOptions,
        );
        break;

      case "sqlite3":
        this._connector = new SQLite3Connector(
          connectionOptions as SQLite3Options,
        );
        break;

      case "mysql":
        this._connector = new MySQLConnector(connectionOptions as MySQLOptions);
        break;

      case "mongo":
        this._connector = new MongoDBConnector(
          connectionOptions as MongoDBOptions,
        );
        break;

      default:
        throw new Error(
          `No connector was found for the given dialect: ${this._dialect}.`,
        );
    }
  }

  /** Test database connection. */
  ping() {
    return this._connector.ping();
  }

  /** Get the database dialect. */
  getDialect() {
    return this._dialect;
  }

  /* Get the database connector. */
  getConnector() {
    return this._connector;
  }

  /** Create the given models in the current database.
   *
   *     await db.sync({ drop: true });
   */
  async sync(options: SyncOptions = {}) {
    if (options.drop) {
      for (const model of this._models) {
        await model.drop();
      }
    }

    for (const model of this._models) {
      await model.createTable();
    }
  }

  /** Associate all the required information for a model to connect to a database.
   *
   *     await db.link([Flight, Airport]);
   */
  link(models: ModelSchema[]) {
    this._models = models;

    this._models.forEach((model) =>
      model._link({
        queryBuilder: this._queryBuilder,
        database: this,
      })
    );

    return this;
  }

  /** Pass on any query to the database.
   *
   *     await db.query("SELECT * FROM `flights`");
   */
  async query(query: QueryDescription): Promise<Model | Model[]> {
    if (this._debug) {
      console.log(query);
    }

    const results = await this._connector.query(query);

    return Array.isArray(results)
      ? results.map((result) =>
        formatResultToModelInstance(query.schema, result)
      )
      : formatResultToModelInstance(query.schema, results);
  }

  /** Compute field matchings tables for model usage. */
  _computeModelFieldMatchings(
    table: string,
    fields: ModelFields,
    withTimestamps: boolean,
  ): {
    toClient: FieldMatchingTable;
    toDatabase: FieldMatchingTable;
  } {
    const databaseDialect = this.getDialect();
    const translator = databaseDialect === "mongo"
      ? new Translator()
      : new SQLTranslator(databaseDialect);

    const modelFields = { ...fields };
    if (withTimestamps) {
      modelFields.updatedAt = "";
      modelFields.createdAt = "";
    }

    const toDatabase: FieldMatchingTable = Object.entries(modelFields).reduce(
      (prev: any, [clientFieldName, fieldType]) => {
        const databaseFieldName = typeof fieldType !== "string" && fieldType.as
          ? fieldType.as
          : (translator.formatFieldNameToDatabase(clientFieldName) as string);

        prev[clientFieldName] = databaseFieldName;
        prev[`${table}.${clientFieldName}`] = `${table}.${databaseFieldName}`;
        return prev;
      },
      {},
    );

    const toClient: FieldMatchingTable = Object.entries(toDatabase).reduce(
      (prev, [clientFieldName, databaseFieldName]) => ({
        ...prev,
        [databaseFieldName]: clientFieldName,
      }),
      {},
    );

    return { toDatabase, toClient };
  }

  /** Close the current database connection. */
  async close() {
    return this._connector.close();
  }
}
