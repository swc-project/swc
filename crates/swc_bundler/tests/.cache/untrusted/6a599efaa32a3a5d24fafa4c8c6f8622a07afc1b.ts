// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/oracle/index.js


// Oracle Client
// -------
import inherits from '../../deps/inherits@2.0.4/inherits.js';
import Client from '../../client.js';

import SchemaCompiler from './schema/compiler.js';
import ColumnBuilder from './schema/columnbuilder.js';
import ColumnCompiler from './schema/columncompiler.js';
import TableCompiler from './schema/tablecompiler.js';
import { isConnectionError } from './utils.js';

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.
function Client_Oracle(config) {
  Client.call(this, config);
}

inherits(Client_Oracle, Client);

Object.assign(Client_Oracle.prototype, {
  dialect: 'oracle',

  driverName: 'oracle',

  schemaCompiler() {
    return new SchemaCompiler(this, ...arguments);
  },

  columnBuilder() {
    return new ColumnBuilder(this, ...arguments);
  },

  columnCompiler() {
    return new ColumnCompiler(this, ...arguments);
  },

  tableCompiler() {
    return new TableCompiler(this, ...arguments);
  },

  // Return the database for the Oracle client.
  database() {
    return this.connectionSettings.database;
  },

  // Position the bindings for the query.
  positionBindings(sql) {
    let questionCount = 0;
    return sql.replace(/\?/g, function () {
      questionCount += 1;
      return `:${questionCount}`;
    });
  },

  _stream(connection, obj, stream, options) {
    return new Promise(function (resolver, rejecter) {
      stream.on('error', (err) => {
        if (isConnectionError(err)) {
          connection.__knex__disposed = err;
        }
        rejecter(err);
      });
      stream.on('end', resolver);
      const queryStream = connection.queryStream(
        obj.sql,
        obj.bindings,
        options
      );
      queryStream.pipe(stream);
      queryStream.on('error', function (error) {
        rejecter(error);
        stream.emit('error', error);
      });
    });
  },
});

export default Client_Oracle;
