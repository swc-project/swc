// Loaded from https://deno.land/x/denodb@v1.0.18/lib/connectors/postgres-connector.ts


import { PostgresClient } from "../../deps.ts";
import type { Connector, ConnectorOptions } from "./connector.ts";
import { SQLTranslator } from "../translators/sql-translator.ts";
import type { QueryDescription } from "../query-builder.ts";
import type { Values } from "../data-types.ts";

export interface PostgresOptions extends ConnectorOptions {
  database: string;
  host: string;
  username: string;
  password: string;
  port?: number;
}

export class PostgresConnector implements Connector {
  _client: PostgresClient;
  _options: PostgresOptions;
  _translator: SQLTranslator;
  _connected = false;

  /** Create a PostgreSQL connection. */
  constructor(options: PostgresOptions) {
    this._options = options;
    this._client = new PostgresClient({
      hostname: options.host,
      user: options.username,
      password: options.password,
      database: options.database,
      port: options.port ?? 5432,
    });
    this._translator = new SQLTranslator("postgres");
  }

  async _makeConnection() {
    if (this._connected) {
      return;
    }

    await this._client.connect();
    this._connected = true;
  }

  async ping() {
    await this._makeConnection();

    try {
      const [{ result }] = (
        await this._client.query("SELECT 1 + 1 as result")
      ).rowsOfObjects();
      return result === 2;
    } catch (error) {
      return false;
    }
  }

  async query(queryDescription: QueryDescription): Promise<any | any[]> {
    await this._makeConnection();

    const query = this._translator.translateToQuery(queryDescription);
    const response = await this._client.query(query);
    const results = response.rowsOfObjects() as Values[];

    if (queryDescription.type === "insert") {
      return results.length === 1 ? results[0] : results;
    }

    return results;
  }

  async close() {
    if (!this._connected) {
      return;
    }

    await this._client.end();
    this._connected = false;
  }
}
