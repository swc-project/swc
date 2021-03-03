// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/mssql/index.js


// MSSQL Client
// -------
import _ from '../../deps/lodash@4.17.15/index.js';
const flatten = _.flatten;
const map = _.map;
const values = _.values;
import inherits from '../../deps/inherits@2.0.4/inherits.js';

import Client from '../../client.js';

import Formatter from '../../formatter.js';
import Transaction from './transaction.js';
import QueryCompiler from './query/compiler.js';
import SchemaCompiler from './schema/compiler.js';
import TableCompiler from './schema/tablecompiler.js';
import ColumnCompiler from './schema/columncompiler.js';

const SQL_INT4 = { MIN: -2147483648, MAX: 2147483647 };
const SQL_BIGINT_SAFE = { MIN: -9007199254740991, MAX: 9007199254740991 };

// Always initialize with the "QueryBuilder" and "QueryCompiler" objects, which
// extend the base 'lib/query/builder' and 'lib/query/compiler', respectively.
function Client_MSSQL(config = {}) {
  // #1235 mssql module wants 'server', not 'host'. This is to enforce the same
  // options object across all dialects.
  if (config && config.connection && config.connection.host) {
    config.connection.server = config.connection.host;
  }

  // mssql always creates pool :( lets try to unpool it as much as possible
  this.mssqlPoolSettings = {
    min: 1,
    max: 1,
    idleTimeoutMillis: Number.MAX_SAFE_INTEGER,
    evictionRunIntervalMillis: 0,
  };

  Client.call(this, config);
}

inherits(Client_MSSQL, Client);

Object.assign(Client_MSSQL.prototype, {
  dialect: 'mssql',

  driverName: 'mssql',

  _driver() {
    const tds = require('tedious');
    const mssqlTedious = require('mssql');
    const base = require('mssql/lib/base');

    // Monkey patch mssql's tedious driver _poolCreate method to fix problem with hanging acquire
    // connection, this should be removed when https://github.com/tediousjs/node-mssql/pull/614 is
    // merged and released.

    // Also since this dialect actually always uses tedious driver (msnodesqlv8 driver should be
    // required in different way), it might be better to use tedious directly, because mssql
    // driver uses always internally extra generic-pool and just adds one unnecessary layer of
    // indirection between database and knex and mssql driver has been lately without maintainer
    // (changing implementation to use tedious will be breaking change though).

    // TODO: remove mssql implementation all together and use tedious directly

    /* istanbul ignore next */
    const mssqlVersion = require('mssql/package.json').version;
    /* istanbul ignore next */
    if (mssqlVersion === '4.1.0') {
      mssqlTedious.ConnectionPool.prototype.release = release;
      mssqlTedious.ConnectionPool.prototype._poolCreate = _poolCreate;
    } else {
      const [major] = mssqlVersion.split('.');
      // if version is not ^5.0.0
      if (major < 5) {
        throw new Error(
          'This knex version only supports mssql driver versions 4.1.0 and 5.0.0+'
        );
      }
    }

    /* istanbul ignore next */
    // in some rare situations release is called when stream is interrupted, but
    // after pool is already destroyed
    function release(connection) {
      if (this.pool) {
        this.pool.release(connection);
      }
    }

    /* istanbul ignore next */
    function _poolCreate() {
      // implementation is copy-pasted from https://github.com/tediousjs/node-mssql/pull/614
      return new base.Promise((resolve, reject) => {
        const cfg = {
          userName: this.config.user,
          password: this.config.password,
          server: this.config.server,
          options: Object.assign({}, this.config.options),
          domain: this.config.domain,
        };

        cfg.options.database = this.config.database;
        cfg.options.port = this.config.port;
        cfg.options.connectTimeout =
          this.config.connectionTimeout || this.config.timeout || 15000;
        cfg.options.requestTimeout =
          this.config.requestTimeout != null
            ? this.config.requestTimeout
            : 15000;
        cfg.options.tdsVersion = cfg.options.tdsVersion || '7_4';
        cfg.options.rowCollectionOnDone = false;
        cfg.options.rowCollectionOnRequestCompletion = false;
        cfg.options.useColumnNames = false;
        cfg.options.appName = cfg.options.appName || 'node-mssql';

        // tedious always connect via tcp when port is specified
        if (cfg.options.instanceName) delete cfg.options.port;

        if (isNaN(cfg.options.requestTimeout))
          cfg.options.requestTimeout = 15000;
        if (cfg.options.requestTimeout === Infinity)
          cfg.options.requestTimeout = 0;
        if (cfg.options.requestTimeout < 0) cfg.options.requestTimeout = 0;

        if (this.config.debug) {
          cfg.options.debug = {
            packet: true,
            token: true,
            data: true,
            payload: true,
          };
        }

        const tedious = new tds.Connection(cfg);

        // prevent calling resolve again on end event
        let alreadyResolved = false;

        function safeResolve(err) {
          if (!alreadyResolved) {
            alreadyResolved = true;
            resolve(err);
          }
        }

        function safeReject(err) {
          if (!alreadyResolved) {
            alreadyResolved = true;
            reject(err);
          }
        }

        tedious.once('end', (evt) => {
          safeReject(
            new base.ConnectionError(
              'Connection ended unexpectedly during connecting'
            )
          );
        });

        tedious.once('connect', (err) => {
          if (err) {
            err = new base.ConnectionError(err);
            return safeReject(err);
          }
          safeResolve(tedious);
        });

        tedious.on('error', (err) => {
          if (err.code === 'ESOCKET') {
            tedious.hasError = true;
            return;
          }

          this.emit('error', err);
        });

        if (this.config.debug) {
          tedious.on('debug', this.emit.bind(this, 'debug', tedious));
        }
      });
    }

    return mssqlTedious;
  },

  formatter() {
    return new MSSQL_Formatter(this, ...arguments);
  },

  transaction() {
    return new Transaction(this, ...arguments);
  },

  queryCompiler() {
    return new QueryCompiler(this, ...arguments);
  },

  schemaCompiler() {
    return new SchemaCompiler(this, ...arguments);
  },

  tableCompiler() {
    return new TableCompiler(this, ...arguments);
  },

  columnCompiler() {
    return new ColumnCompiler(this, ...arguments);
  },

  wrapIdentifierImpl(value) {
    if (value === '*') {
      return '*';
    }

    return `[${value.replace(/[[\]']+/g, '')}]`;
  },

  // Get a raw connection, called by the `pool` whenever a new
  // connection needs to be added to the pool.
  acquireRawConnection() {
    return new Promise((resolver, rejecter) => {
      const settings = Object.assign({}, this.connectionSettings);
      settings.pool = this.mssqlPoolSettings;

      const connection = new this.driver.ConnectionPool(settings);
      connection.connect((err) => {
        if (err) {
          return rejecter(err);
        }
        connection.on('error', (err) => {
          connection.__knex__disposed = err;
        });
        resolver(connection);
      });
    });
  },

  validateConnection(connection) {
    if (connection.connected === true) {
      return true;
    }

    return false;
  },

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.
  destroyRawConnection(connection) {
    return connection.close().catch((err) => {
      // some times close will reject just because pool has already been destoyed
      // internally by the driver there is nothing we can do in this case
    });
  },

  // Position the bindings for the query.
  positionBindings(sql) {
    let questionCount = -1;
    return sql.replace(/\?/g, function () {
      questionCount += 1;
      return `@p${questionCount}`;
    });
  },

  // Grab a connection, run the query via the MSSQL streaming interface,
  // and pass that through to the stream we've sent back to the client.
  _stream(connection, obj, stream) {
    if (!obj || typeof obj === 'string') obj = { sql: obj };
    return new Promise((resolver, rejecter) => {
      stream.on('error', (err) => {
        rejecter(err);
      });
      stream.on('end', resolver);
      const { sql } = obj;
      if (!sql) return resolver();
      const req = (connection.tx_ || connection).request();
      //req.verbose = true;
      req.multiple = true;
      req.stream = true;
      if (obj.bindings) {
        for (let i = 0; i < obj.bindings.length; i++) {
          this._setReqInput(req, i, obj.bindings[i]);
        }
      }
      req.pipe(stream);
      req.query(sql);
    });
  },

  // Runs the query on the specified connection, providing the bindings
  // and any other necessary prep work.
  _query(connection, obj) {
    const client = this;
    if (!obj || typeof obj === 'string') obj = { sql: obj };
    return new Promise((resolver, rejecter) => {
      const { sql } = obj;
      if (!sql) return resolver();
      const req = (connection.tx_ || connection).request();
      // req.verbose = true;
      req.multiple = true;
      if (obj.bindings) {
        for (let i = 0; i < obj.bindings.length; i++) {
          client._setReqInput(req, i, obj.bindings[i]);
        }
      }
      req.query(sql, (err, recordset) => {
        if (err) {
          return rejecter(err);
        }
        obj.response = recordset.recordsets[0];
        resolver(obj);
      });
    });
  },

  // sets a request input parameter. Detects bigints and decimals and sets type appropriately.
  _setReqInput(req, i, binding) {
    if (typeof binding == 'number') {
      if (binding % 1 !== 0) {
        req.input(`p${i}`, this.driver.Decimal(38, 10), binding);
      } else if (binding < SQL_INT4.MIN || binding > SQL_INT4.MAX) {
        if (binding < SQL_BIGINT_SAFE.MIN || binding > SQL_BIGINT_SAFE.MAX) {
          throw new Error(
            `Bigint must be safe integer or must be passed as string, saw ${binding}`
          );
        }
        req.input(`p${i}`, this.driver.BigInt, binding);
      } else {
        req.input(`p${i}`, this.driver.Int, binding);
      }
    } else {
      req.input(`p${i}`, binding);
    }
  },

  // Process the response as returned from the query.
  processResponse(obj, runner) {
    if (obj == null) return;
    const { response, method } = obj;
    if (obj.output) return obj.output.call(runner, response);
    switch (method) {
      case 'select':
      case 'pluck':
      case 'first':
        if (method === 'pluck') return map(response, obj.pluck);
        return method === 'first' ? response[0] : response;
      case 'insert':
      case 'del':
      case 'update':
      case 'counter':
        if (obj.returning) {
          if (obj.returning === '@@rowcount') {
            return response[0][''];
          }

          if (
            (Array.isArray(obj.returning) && obj.returning.length > 1) ||
            obj.returning[0] === '*'
          ) {
            return response;
          }
          // return an array with values if only one returning value was specified
          return flatten(map(response, values));
        }
        return response;
      default:
        return response;
    }
  },
});

class MSSQL_Formatter extends Formatter {
  // Accepts a string or array of columns to wrap as appropriate.
  columnizeWithPrefix(prefix, target) {
    const columns = typeof target === 'string' ? [target] : target;
    let str = '',
      i = -1;
    while (++i < columns.length) {
      if (i > 0) str += ', ';
      str += prefix + this.wrap(columns[i]);
    }
    return str;
  }
}

export default Client_MSSQL;
