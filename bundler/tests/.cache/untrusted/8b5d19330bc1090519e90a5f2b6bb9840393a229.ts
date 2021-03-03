// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/oracledb/transaction.js


import Transaction from '../../transaction.js';
import { timeout, KnexTimeoutError } from '../../util/timeout.js';
import debuglib from '../../deps/debug@4.1.1/src/index.js';
const debugTx = debuglib('knex:tx');

export default class Oracle_Transaction extends Transaction {
  // disable autocommit to allow correct behavior (default is true)
  begin() {
    return Promise.resolve();
  }

  async commit(conn, value) {
    this._completed = true;
    try {
      await conn.commitAsync();
      this._resolver(value);
    } catch (err) {
      this._rejecter(err);
    }
  }

  release(conn, value) {
    return this._resolver(value);
  }

  rollback(conn, err) {
    this._completed = true;
    debugTx('%s: rolling back', this.txid);
    return timeout(conn.rollbackAsync(), 5000)
      .catch((e) => {
        if (!(e instanceof KnexTimeoutError)) {
          return Promise.reject(e);
        }
        this._rejecter(e);
      })
      .then(() => {
        if (err === undefined) {
          if (this.doNotRejectOnRollback) {
            this._resolver();
            return;
          }
          err = new Error(`Transaction rejected with non-error: ${err}`);
        }
        this._rejecter(err);
      });
  }

  savepoint(conn) {
    return this.query(conn, `SAVEPOINT ${this.txid}`);
  }

  async acquireConnection(config, cb) {
    const configConnection = config && config.connection;

    const connection =
      configConnection || (await this.client.acquireConnection());
    try {
      connection.__knexTxId = this.txid;
      connection.isTransaction = true;
      return await cb(connection);
    } finally {
      debugTx('%s: releasing connection', this.txid);
      connection.isTransaction = false;
      try {
        await connection.commitAsync();
      } catch (err) {
        this._rejecter(err);
      } finally {
        if (!configConnection) {
          await this.client.releaseConnection(connection);
        } else {
          debugTx('%s: not releasing external connection', this.txid);
        }
      }
    }
  }
};
