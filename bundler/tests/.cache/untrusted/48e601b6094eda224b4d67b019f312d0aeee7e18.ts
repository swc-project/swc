// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/redshift/transaction.js


import Transaction from '../../transaction.js';

export default class Redshift_Transaction extends Transaction {
  savepoint(conn) {
    this.trxClient.logger('Redshift does not support savepoints.');
    return Promise.resolve();
  }

  release(conn, value) {
    this.trxClient.logger('Redshift does not support savepoints.');
    return Promise.resolve();
  }

  rollbackTo(conn, error) {
    this.trxClient.logger('Redshift does not support savepoints.');
    return Promise.resolve();
  }
};
