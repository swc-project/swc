// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/mysql2/transaction.js


import Transaction from '../../transaction.js';
import debuglib from '../../deps/debug@4.1.1/src/index.js';
const debug = debuglib('knex:tx');

class Transaction_MySQL2 extends Transaction {}

Object.assign(Transaction_MySQL2.prototype, {
  query(conn, sql, status, value) {
    const t = this;
    const q = this.trxClient
      .query(conn, sql)
      .catch((err) => {
        if (err.code === 'ER_SP_DOES_NOT_EXIST') {
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
          return res;
        }
      });
    if (status === 1 || status === 2) {
      t._completed = true;
    }
    return q;
  },
});

export default Transaction_MySQL2;
