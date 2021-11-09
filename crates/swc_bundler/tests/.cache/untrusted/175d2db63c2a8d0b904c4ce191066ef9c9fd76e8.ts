// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/sqlite3/index.js


// SQLite3
// -------
import inherits from '../../deps/inherits@2.0.4/inherits.js';
import _ from '../../deps/lodash@4.17.15/index.js';
const defaults = _.defaults;
const map = _.map;
import { promisify } from '../../deps/@jspm/core@1.1.0/nodelibs/util.js';

import Client from '../../client.js';

import QueryCompiler from './query/compiler.js';
import SchemaCompiler from './schema/compiler.js';
import ColumnCompiler from './schema/columncompiler.js';
import TableCompiler from './schema/tablecompiler.js';
import SQLite3_DDL from './schema/ddl.js';
import SQLite3_Formatter from './formatter.js';

function Client_SQLite3(config) {
  Client.call(this, config);
  if (config.useNullAsDefault === undefined) {
    this.logger.warn(
      'sqlite does not support inserting default values. Set the ' +
        '`useNullAsDefault` flag to hide this warning. ' +
        '(see docs http://knexjs.org/#Builder-insert).'
    );
  }
}

inherits(Client_SQLite3, Client);

Object.assign(Client_SQLite3.prototype, {
  dialect: 'sqlite3',

  driverName: 'sqlite3',

  _driver() {
    return require('sqlite3');
  },

  schemaCompiler() {
    return new SchemaCompiler(this, ...arguments);
  },

  queryCompiler() {
    return new QueryCompiler(this, ...arguments);
  },

  columnCompiler() {
    return new ColumnCompiler(this, ...arguments);
  },

  tableCompiler() {
    return new TableCompiler(this, ...arguments);
  },

  ddl(compiler, pragma, connection) {
    return new SQLite3_DDL(this, compiler, pragma, connection);
  },

  wrapIdentifierImpl(value) {
    return value !== '*' ? `\`${value.replace(/`/g, '``')}\`` : '*';
  },

  // Get a raw connection from the database, returning a promise with the connection object.
  acquireRawConnection() {
    return new Promise((resolve, reject) => {
      const db = new this.driver.Database(
        this.connectionSettings.filename,
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve(db);
        }
      );
    });
  },

  // Used to explicitly close a connection, called internally by the pool when
  // a connection times out or the pool is shutdown.
  async destroyRawConnection(connection) {
    const close = promisify((cb) => connection.close(cb));
    return close();
  },

  // Runs the query on the specified connection, providing the bindings and any
  // other necessary prep work.
  _query(connection, obj) {
    const { method } = obj;
    let callMethod;
    switch (method) {
      case 'insert':
      case 'update':
      case 'counter':
      case 'del':
        callMethod = 'run';
        break;
      default:
        callMethod = 'all';
    }
    return new Promise(function (resolver, rejecter) {
      if (!connection || !connection[callMethod]) {
        return rejecter(
          new Error(`Error calling ${callMethod} on connection.`)
        );
      }
      connection[callMethod](obj.sql, obj.bindings, function (err, response) {
        if (err) return rejecter(err);
        obj.response = response;

        // We need the context here, as it contains
        // the "this.lastID" or "this.changes"
        obj.context = this;
        return resolver(obj);
      });
    });
  },

  _stream(connection, sql, stream) {
    const client = this;
    return new Promise(function (resolver, rejecter) {
      stream.on('error', rejecter);
      stream.on('end', resolver);
      return client
        ._query(connection, sql)
        .then((obj) => obj.response)
        .then((rows) => rows.forEach((row) => stream.write(row)))
        .catch(function (err) {
          stream.emit('error', err);
        })
        .then(function () {
          stream.end();
        });
    });
  },

  // Ensures the response is returned in the same format as other clients.
  processResponse(obj, runner) {
    const ctx = obj.context;
    let { response } = obj;
    if (obj.output) return obj.output.call(runner, response);
    switch (obj.method) {
      case 'select':
      case 'pluck':
      case 'first':
        if (obj.method === 'pluck') response = map(response, obj.pluck);
        return obj.method === 'first' ? response[0] : response;
      case 'insert':
        return [ctx.lastID];
      case 'del':
      case 'update':
      case 'counter':
        return ctx.changes;
      default:
        return response;
    }
  },

  poolDefaults() {
    return defaults(
      { min: 1, max: 1 },
      Client.prototype.poolDefaults.call(this)
    );
  },

  formatter() {
    return new SQLite3_Formatter(this, ...arguments);
  },
});

export default Client_SQLite3;
