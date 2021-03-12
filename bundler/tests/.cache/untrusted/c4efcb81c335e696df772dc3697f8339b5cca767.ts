// Loaded from https://raw.githubusercontent.com/deno-postgres/deno-postgres/master/pool.ts


import { PoolClient, QueryClient } from "./client.ts";
import { Connection, ResultType } from "./connection/connection.ts";
import {
  ConnectionOptions,
  ConnectionParams,
  ConnectionString,
  createParams,
} from "./connection/connection_params.ts";
import { DeferredStack } from "./connection/deferred.ts";
import { Query, QueryResult } from "./query/query.ts";

export class Pool extends QueryClient {
  private _connectionParams: ConnectionParams;
  private _connections!: Array<Connection>;
  private _availableConnections!: DeferredStack<Connection>;
  private _maxSize: number;
  public ready: Promise<void>;
  private _lazy: boolean;

  constructor(
    connectionParams: ConnectionOptions | ConnectionString | undefined,
    maxSize: number,
    lazy?: boolean,
  ) {
    super();
    this._connectionParams = createParams(connectionParams);
    this._maxSize = maxSize;
    this._lazy = !!lazy;
    this.ready = this._startup();
  }

  _executeQuery(query: Query, result: ResultType): Promise<QueryResult> {
    return this._execute(query, result);
  }

  private async _createConnection(): Promise<Connection> {
    const connection = new Connection(this._connectionParams);
    await connection.startup();
    return connection;
  }

  /** pool max size */
  get maxSize(): number {
    return this._maxSize;
  }

  /** number of connections created */
  get size(): number {
    if (this._availableConnections == null) {
      return 0;
    }
    return this._availableConnections.size;
  }

  /** number of available connections */
  get available(): number {
    if (this._availableConnections == null) {
      return 0;
    }
    return this._availableConnections.available;
  }

  private async _startup(): Promise<void> {
    const initSize = this._lazy ? 1 : this._maxSize;
    const connecting = [...Array(initSize)].map(async () =>
      await this._createConnection()
    );
    this._connections = await Promise.all(connecting);
    this._availableConnections = new DeferredStack(
      this._maxSize,
      this._connections,
      this._createConnection.bind(this),
    );
  }

  private async _execute(query: Query, type: ResultType): Promise<QueryResult> {
    await this.ready;
    const connection = await this._availableConnections.pop();
    try {
      return await connection.query(query, type);
    } catch (error) {
      throw error;
    } finally {
      this._availableConnections.push(connection);
    }
  }

  async connect(): Promise<PoolClient> {
    await this.ready;
    const connection = await this._availableConnections.pop();
    const release = () => this._availableConnections.push(connection);
    return new PoolClient(connection, release);
  }

  async end(): Promise<void> {
    await this.ready;
    while (this.available > 0) {
      const conn = await this._availableConnections.pop();
      await conn.end();
    }
  }
}
