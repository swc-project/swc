// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/mysql2/index.js


// MySQL2 Client
// -------
import inherits from '../../deps/inherits@2.0.4/inherits.js';
import Client_MySQL from '../mysql/index.js';
import Transaction from './transaction.js';

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.
function Client_MySQL2(config) {
  Client_MySQL.call(this, config);
}
inherits(Client_MySQL2, Client_MySQL);

Object.assign(Client_MySQL2.prototype, {
  // The "dialect", for reference elsewhere.
  driverName: 'mysql2',

  transaction() {
    return new Transaction(this, ...arguments);
  },

  _driver() {
    return require('mysql2');
  },

  validateConnection(connection) {
    if (connection._fatalError) {
      return false;
    }
    return true;
  },
});

export default Client_MySQL2;
