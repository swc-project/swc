// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/redshift/index.js


// Redshift
// -------
import inherits from '../../deps/inherits@2.0.4/inherits.js';
import Client_PG from '../postgres/index.js';
import _ from '../../deps/lodash@4.17.15/index.js';
const map = _.map;

import Transaction from './transaction.js';
import QueryCompiler from './query/compiler.js';
import ColumnBuilder from './schema/columnbuilder.js';
import ColumnCompiler from './schema/columncompiler.js';
import TableCompiler from './schema/tablecompiler.js';
import SchemaCompiler from './schema/compiler.js';

function Client_Redshift(config) {
  Client_PG.apply(this, arguments);
}
inherits(Client_Redshift, Client_PG);

Object.assign(Client_Redshift.prototype, {
  transaction() {
    return new Transaction(this, ...arguments);
  },

  queryCompiler() {
    return new QueryCompiler(this, ...arguments);
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

  schemaCompiler() {
    return new SchemaCompiler(this, ...arguments);
  },

  dialect: 'redshift',

  driverName: 'pg-redshift',

  _driver() {
    return require('pg');
  },

  // Ensures the response is returned in the same format as other clients.
  processResponse(obj, runner) {
    const resp = obj.response;
    if (obj.output) return obj.output.call(runner, resp);
    if (obj.method === 'raw') return resp;
    if (resp.command === 'SELECT') {
      if (obj.method === 'first') return resp.rows[0];
      if (obj.method === 'pluck') return map(resp.rows, obj.pluck);
      return resp.rows;
    }
    if (
      resp.command === 'INSERT' ||
      resp.command === 'UPDATE' ||
      resp.command === 'DELETE'
    ) {
      return resp.rowCount;
    }
    return resp;
  },
});

export default Client_Redshift;
