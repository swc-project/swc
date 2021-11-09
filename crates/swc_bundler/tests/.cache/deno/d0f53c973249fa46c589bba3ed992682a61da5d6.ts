// Loaded from https://deno.land/x/denodb@v1.0.18/lib/connectors/sqlite3-connector.ts


import { SQLiteClient } from "../../deps.ts";
import type { Connector, ConnectorOptions } from "./connector.ts";
import type { QueryDescription } from "../query-builder.ts";
import type { FieldValue } from "../data-types.ts";
import { SQLTranslator } from "../translators/sql-translator.ts";

export interface SQLite3Options extends ConnectorOptions {
  filepath: string;
}

export class SQLite3Connector implements Connector {
  _client: SQLiteClient;
  _options: SQLite3Options;
  _translator: SQLTranslator;
  _connected = false;

  /** Create a SQLite connection. */
  constructor(options: SQLite3Options) {
    this._options = options;
    this._client = new SQLiteClient(this._options.filepath);
    this._translator = new SQLTranslator("sqlite3");
  }

  async _makeConnection() {
    if (this._connected) {
      return;
    }

    this._connected = true;
  }

  async ping() {
    await this._makeConnection();

    try {
      let connected = false;

      for (const [result] of this._client.query("SELECT 1 + 1")) {
        connected = result === 2;
      }

      return connected;
    } catch (error) {
      return false;
    }
  }

  async query(queryDescription: QueryDescription): Promise<any | any[]> {
    await this._makeConnection();

    const query = this._translator.translateToQuery(queryDescription);
    const subqueries = query.split(";");

    const results = subqueries.map(async (subquery, index) => {
      const response = this._client.query(subquery + ";", []);

      if (index < subqueries.length - 1) {
        response.return();
        return [];
      }

      const results = [];
      let columns;

      try {
        columns = response.columns();
      } catch (error) {
        // If there are no matching records, .columns will throw an error

        if (
          (queryDescription.type === "insert" ||
            queryDescription.type === "update") &&
          queryDescription.values
        ) {
          if (Array.isArray(queryDescription.values)) {
            return await Promise.all(
              queryDescription.values.map((values) =>
                queryDescription.schema.where(values).first()
              ),
            );
          }

          return queryDescription.schema.where(queryDescription.values).first();
        }

        return [];
      }

      for (const row of response) {
        const result: { [k: string]: FieldValue } = {};

        let i = 0;
        for (const column of row!) {
          const columnName = columns[i].name;
          if (columnName === "count(*)") {
            result.count = column;
          } else if (columnName.startsWith("max(")) {
            result.max = column;
          } else if (columnName.startsWith("min(")) {
            result.min = column;
          } else if (columnName.startsWith("sum(")) {
            result.sum = column;
          } else if (columnName.startsWith("avg(")) {
            result.avg = column;
          } else {
            result[columns[i].name] = column;
          }

          i++;
        }

        results.push(result);
      }

      return results;
    });

    return results[results.length - 1];
  }

  async close() {
    if (!this._connected) {
      return;
    }

    this._client.close();
    this._connected = false;
  }
}
