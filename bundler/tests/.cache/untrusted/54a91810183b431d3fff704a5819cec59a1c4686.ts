// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/mssql/transaction.js


import Transaction from '../../transaction.js';
import debuglib from '../../deps/debug@4.1.1/src/index.js';
const debug = debuglib('knex:tx');

export default class Transaction_MSSQL extends Transaction {
  begin(conn) {
    debug('%s: begin', this.txid);
    return conn.tx_.begin().then(this._resolver, this._rejecter);
  }

  async savepoint(conn) {
    debug('%s: savepoint at', this.txid);
    return this.query(conn, `SAVE TRANSACTION ${this.txid}`);
  }

  commit(conn, value) {
    this._completed = true;
    debug('%s: commit', this.txid);
    return conn.tx_.commit().then(() => this._resolver(value), this._rejecter);
  }

  release(conn, value) {
    return this._resolver(value);
  }

  rollback(conn, error) {
    this._completed = true;
    debug('%s: rolling back', this.txid);
    return conn.tx_.rollback().then(
      () => {
        let err = error;
        if (error === undefined) {
          if (this.doNotRejectOnRollback) {
            this._resolver();
            return;
          }
          err = new Error(`Transaction rejected with non-error: ${error}`);
        }
        this._rejecter(err);
      },
      (err) => {
        if (error) err.originalError = error;
        return this._rejecter(err);
      }
    );
  }

  async rollbackTo(conn, error) {
    debug('%s: rolling backTo', this.txid);
    await this.query(conn, `ROLLBACK TRANSACTION ${this.txid}`, 2, error);

    this._rejecter(error);
  }

  // Acquire a connection and create a disposer - either using the one passed
  // via config or getting one off the client. The disposer will be called once
  // the original promise is marked completed.
  async acquireConnection(config, cb) {
    const configConnection = config && config.connection;
    const conn =
      (this.outerTx && this.outerTx.conn) ||
      configConnection ||
      (await this.client.acquireConnection());

    try {
      conn.__knexTxId = this.txid;
      if (!this.outerTx) {
        this.conn = conn;
        conn.tx_ = conn.transaction();
      }

      return await cb(conn);
    } finally {
      if (!this.outerTx) {
        if (conn.tx_) {
          if (!this._completed) {
            debug('%s: unreleased transaction', this.txid);
            conn.tx_.rollback();
          }
          conn.tx_ = null;
        }
        this.conn = null;
        if (!configConnection) {
          debug('%s: releasing connection', this.txid);
          this.client.releaseConnection(conn);
        } else {
          debug('%s: not releasing external connection', this.txid);
        }
      }
    }
  }
};
