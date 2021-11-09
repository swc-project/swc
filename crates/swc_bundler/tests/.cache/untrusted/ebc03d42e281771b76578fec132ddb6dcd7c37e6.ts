// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/transaction.js


// Transaction
// -------
import { EventEmitter } from './deps/@jspm/core@1.1.0/nodelibs/events.js';
import Debug from './deps/debug@4.1.1/src/index.js';

import makeKnex from './util/make-knex.js';
import { callbackify } from './deps/@jspm/core@1.1.0/nodelibs/util.js';
import { timeout, KnexTimeoutError } from './util/timeout.js';
import finallyMixin from './util/finally-mixin.js';

const debug = Debug('knex:tx');

import _ from './deps/lodash@4.17.15/index.js';
const uniqueId = _.uniqueId;

// FYI: This is defined as a function instead of a constant so that
//      each Transactor can have its own copy of the default config.
//      This will minimize the impact of bugs that might be introduced
//      if a Transactor ever mutates its config.
function DEFAULT_CONFIG() {
  return {
    userParams: {},
    doNotRejectOnRollback: true,
  };
}

// Acts as a facade for a Promise, keeping the internal state
// and managing any child transactions.
class Transaction extends EventEmitter {
  constructor(client, container, config = DEFAULT_CONFIG(), outerTx = null) {
    super();
    this.userParams = config.userParams;
    this.doNotRejectOnRollback = config.doNotRejectOnRollback;

    const txid = (this.txid = uniqueId('trx'));

    this.client = client;
    this.logger = client.logger;
    this.outerTx = outerTx;
    this.trxClient = undefined;
    this._completed = false;
    this._debug = client.config && client.config.debug;

    debug(
      '%s: Starting %s transaction',
      txid,
      outerTx ? 'nested' : 'top level'
    );

    // `this` can potentially serve as an `outerTx` for another
    // Transaction.  So, go ahead and establish `_lastChild` now.
    this._lastChild = Promise.resolve();

    const _previousSibling = outerTx ? outerTx._lastChild : Promise.resolve();

    // FYI: As you will see in a moment, this Promise will be used to construct
    //      2 separate Promise Chains.  This ensures that each Promise Chain
    //      can establish its error-handling semantics without interfering
    //      with the other Promise Chain.
    const basePromise = _previousSibling.then(() =>
      this._evaluateContainer(config, container)
    );

    // FYI: This is the Promise Chain for EXTERNAL use.  It ensures that the
    //      caller must handle any exceptions that result from `basePromise`.
    this._promise = basePromise.then((x) => x);

    if (outerTx) {
      // FYI: This is the Promise Chain for INTERNAL use.  It serves as a signal
      //      for when the next sibling should begin its execution.  Therefore,
      //      exceptions are caught and ignored.
      outerTx._lastChild = basePromise.catch(() => {});
    }
  }

  isCompleted() {
    return (
      this._completed || (this.outerTx && this.outerTx.isCompleted()) || false
    );
  }

  begin(conn) {
    return this.query(conn, 'BEGIN;');
  }

  savepoint(conn) {
    return this.query(conn, `SAVEPOINT ${this.txid};`);
  }

  commit(conn, value) {
    return this.query(conn, 'COMMIT;', 1, value);
  }

  release(conn, value) {
    return this.query(conn, `RELEASE SAVEPOINT ${this.txid};`, 1, value);
  }

  rollback(conn, error) {
    return timeout(this.query(conn, 'ROLLBACK', 2, error), 5000).catch(
      (err) => {
        if (!(err instanceof KnexTimeoutError)) {
          return Promise.reject(err);
        }
        this._rejecter(error);
      }
    );
  }

  rollbackTo(conn, error) {
    return timeout(
      this.query(conn, `ROLLBACK TO SAVEPOINT ${this.txid}`, 2, error),
      5000
    ).catch((err) => {
      if (!(err instanceof KnexTimeoutError)) {
        return Promise.reject(err);
      }
      this._rejecter(error);
    });
  }

  query(conn, sql, status, value) {
    const q = this.trxClient
      .query(conn, sql)
      .catch((err) => {
        status = 2;
        value = err;
        this._completed = true;
        debug('%s error running transaction query', this.txid);
      })
      .then((res) => {
        if (status === 1) {
          this._resolver(value);
        }
        if (status === 2) {
          if (value === undefined) {
            if (this.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
              this._resolver();
              return;
            }

            value = new Error(`Transaction rejected with non-error: ${value}`);
          }
          this._rejecter(value);
        }
        return res;
      });
    if (status === 1 || status === 2) {
      this._completed = true;
    }
    return q;
  }

  debug(enabled) {
    this._debug = arguments.length ? enabled : true;
    return this;
  }

  async _evaluateContainer(config, container) {
    return this.acquireConnection(config, (connection) => {
      const trxClient = (this.trxClient = makeTxClient(
        this,
        this.client,
        connection
      ));
      const init = this.client.transacting
        ? this.savepoint(connection)
        : this.begin(connection);
      const executionPromise = new Promise((resolver, rejecter) => {
        this._resolver = resolver;
        this._rejecter = rejecter;
      });

      init
        .then(() => {
          return makeTransactor(this, connection, trxClient);
        })
        .then((transactor) => {
          transactor.executionPromise = executionPromise;

          // If we've returned a "thenable" from the transaction container, assume
          // the rollback and commit are chained to this object's success / failure.
          // Directly thrown errors are treated as automatic rollbacks.
          let result;
          try {
            result = container(transactor);
          } catch (err) {
            result = Promise.reject(err);
          }
          if (result && result.then && typeof result.then === 'function') {
            result
              .then((val) => {
                return transactor.commit(val);
              })
              .catch((err) => {
                return transactor.rollback(err);
              });
          }
          return null;
        })
        .catch((e) => {
          return this._rejecter(e);
        });

      return executionPromise;
    });
  }

  // Acquire a connection and create a disposer - either using the one passed
  // via config or getting one off the client. The disposer will be called once
  // the original promise is marked completed.
  async acquireConnection(config, cb) {
    const configConnection = config && config.connection;
    const connection =
      configConnection || (await this.client.acquireConnection());

    try {
      connection.__knexTxId = this.txid;
      return await cb(connection);
    } finally {
      if (!configConnection) {
        debug('%s: releasing connection', this.txid);
        this.client.releaseConnection(connection);
      } else {
        debug('%s: not releasing external connection', this.txid);
      }
    }
  }

  then(onResolve, onReject) {
    return this._promise.then(onResolve, onReject);
  }

  catch(onReject) {
    return this._promise.catch(onReject);
  }

  asCallback(cb) {
    callbackify(() => this._promise)(cb);
    return this._promise;
  }
}
finallyMixin(Transaction.prototype);

// The transactor is a full featured knex object, with a "commit", a "rollback"
// and a "savepoint" function. The "savepoint" is just sugar for creating a new
// transaction. If the rollback is run inside a savepoint, it rolls back to the
// last savepoint - otherwise it rolls back the transaction.
function makeTransactor(trx, connection, trxClient) {
  const transactor = makeKnex(trxClient);

  transactor.context.withUserParams = () => {
    throw new Error(
      'Cannot set user params on a transaction - it can only inherit params from main knex instance'
    );
  };

  transactor.isTransaction = true;
  transactor.userParams = trx.userParams || {};

  transactor.context.transaction = function (container, options) {
    if (!options) {
      options = { doNotRejectOnRollback: true };
    } else if (options.doNotRejectOnRollback === undefined) {
      options.doNotRejectOnRollback = true;
    }

    return this._transaction(container, options, trx);
  };

  transactor.savepoint = function (container, options) {
    return transactor.transaction(container, options);
  };

  if (trx.client.transacting) {
    transactor.commit = (value) => trx.release(connection, value);
    transactor.rollback = (error) => trx.rollbackTo(connection, error);
  } else {
    transactor.commit = (value) => trx.commit(connection, value);
    transactor.rollback = (error) => trx.rollback(connection, error);
  }

  transactor.isCompleted = () => trx.isCompleted();

  return transactor;
}

// We need to make a client object which always acquires the same
// connection and does not release back into the pool.
function makeTxClient(trx, client, connection) {
  const trxClient = Object.create(client.constructor.prototype);
  trxClient.version = client.version;
  trxClient.config = client.config;
  trxClient.driver = client.driver;
  trxClient.connectionSettings = client.connectionSettings;
  trxClient.transacting = true;
  trxClient.valueForUndefined = client.valueForUndefined;
  trxClient.logger = client.logger;

  trxClient.on('query', function (arg) {
    trx.emit('query', arg);
    client.emit('query', arg);
  });

  trxClient.on('query-error', function (err, obj) {
    trx.emit('query-error', err, obj);
    client.emit('query-error', err, obj);
  });

  trxClient.on('query-response', function (response, obj, builder) {
    trx.emit('query-response', response, obj, builder);
    client.emit('query-response', response, obj, builder);
  });

  const _query = trxClient.query;
  trxClient.query = function (conn, obj) {
    const completed = trx.isCompleted();
    return new Promise(function (resolve, reject) {
      try {
        if (conn !== connection)
          throw new Error('Invalid connection for transaction query.');
        if (completed) completedError(trx, obj);
        resolve(_query.call(trxClient, conn, obj));
      } catch (e) {
        reject(e);
      }
    });
  };
  const _stream = trxClient.stream;
  trxClient.stream = function (conn, obj, stream, options) {
    const completed = trx.isCompleted();
    return new Promise(function (resolve, reject) {
      try {
        if (conn !== connection)
          throw new Error('Invalid connection for transaction query.');
        if (completed) completedError(trx, obj);
        resolve(_stream.call(trxClient, conn, obj, stream, options));
      } catch (e) {
        reject(e);
      }
    });
  };
  trxClient.acquireConnection = function () {
    return Promise.resolve(connection);
  };
  trxClient.releaseConnection = function () {
    return Promise.resolve();
  };

  return trxClient;
}

function completedError(trx, obj) {
  const sql = typeof obj === 'string' ? obj : obj && obj.sql;
  debug('%s: Transaction completed: %s', trx.txid, sql);
  throw new Error(
    'Transaction query already complete, run with DEBUG=knex:tx for more info'
  );
}

export default Transaction;
