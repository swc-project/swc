// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/mysql/transaction.js


import Transaction from '../../transaction.js';
import Debug from '../../deps/debug@4.1.1/src/index.js';

const debug = Debug('knex:tx');

class Transaction_MySQL extends Transaction {}

Object.assign(Transaction_MySQL.prototype, {
  query(conn, sql, status, value) {
    const t = this;
    const q = this.trxClient
      .query(conn, sql)
      .catch((err) => {
        if (err.errno === 1305) {
          this.trxClient.logger.warn(
            'Transaction was implicitly committed, do not mix transactions and ' +
              'DDL with MySQL (#805)'
          );
          return;
        }

        status = 2;
        value = err;
        t._completed = true;
        debug('%s error running transaction query', t.txid);
      })
      .then(function (res) {
        if (status === 1) t._resolver(value);
        if (status === 2) {
          if (value === undefined) {
            if (t.doNotRejectOnRollback && /^ROLLBACK\b/i.test(sql)) {
              t._resolver();
              return;
            }
            value = new Error(`Transaction rejected with non-error: ${value}`);
          }
          t._rejecter(value);
        }
        return res;
      });
    if (status === 1 || status === 2) {
      t._completed = true;
    }
    return q;
  },
});

export default Transaction_MySQL;
