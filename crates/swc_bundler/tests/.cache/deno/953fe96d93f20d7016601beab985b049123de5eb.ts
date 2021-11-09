// Loaded from https://deno.land/x/mysql/src/pool.ts


import { DeferredStack } from "./deferred.ts";
import { Connection } from "./connection.ts";
import { log } from "./logger.ts";

/** @ignore */
export class PoolConnection extends Connection {
  _pool?: ConnectionPool = undefined;

  private _idleTimer?: number = undefined;
  private _idle = false;

  /**
   * Should be called by the pool.
   */
  enterIdle() {
    this._idle = true;
    if (this.config.idleTimeout) {
      this._idleTimer = setTimeout(() => {
        log.info("connection idle timeout");
        this._pool!.remove(this);
        try {
          this.close();
        } catch (error) {
          log.warning(`error closing idle connection`, error);
        }
      }, this.config.idleTimeout);
    }
  }

  /**
   * Should be called by the pool.
   */
  exitIdle() {
    this._idle = false;
    if (this._idleTimer !== undefined) {
      clearTimeout(this._idleTimer);
    }
  }

  /**
   * Remove the connection from the pool permanently, when the connection is not usable.
   */
  removeFromPool() {
    this._pool!.reduceSize();
    this._pool = undefined;
  }

  returnToPool() {
    this._pool?.push(this);
  }
}

/** @ignore */
export class ConnectionPool {
  _deferred: DeferredStack<PoolConnection>;
  _connections: PoolConnection[] = [];
  _closed: boolean = false;

  constructor(maxSize: number, creator: () => Promise<PoolConnection>) {
    this._deferred = new DeferredStack(maxSize, this._connections, async () => {
      const conn = await creator();
      conn._pool = this;
      return conn;
    });
  }

  get info() {
    return {
      size: this._deferred.size,
      maxSize: this._deferred.maxSize,
      available: this._deferred.available,
    };
  }

  push(conn: PoolConnection) {
    if (this._closed) {
      conn.close();
      this.reduceSize();
    }
    if (this._deferred.push(conn)) {
      conn.enterIdle();
    }
  }

  async pop(): Promise<PoolConnection> {
    if (this._closed) {
      throw new Error("Connection pool is closed");
    }
    let conn = this._deferred.tryPopAvailable();
    if (conn) {
      conn.exitIdle();
    } else {
      conn = await this._deferred.pop();
    }
    return conn;
  }

  remove(conn: PoolConnection) {
    return this._deferred.remove(conn);
  }

  /**
   * Close the pool and all connections in the pool.
   * 
   * After closing, pop() will throw an error,
   * push() will close the connection immediately.
   */
  close() {
    this._closed = true;

    let conn: PoolConnection | undefined;
    while (conn = this._deferred.tryPopAvailable()) {
      conn.exitIdle();
      conn.close();
      this.reduceSize();
    }
  }

  reduceSize() {
    this._deferred.reduceSize();
  }
}
