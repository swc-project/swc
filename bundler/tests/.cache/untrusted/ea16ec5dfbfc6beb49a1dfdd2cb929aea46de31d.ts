// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/sqlite3/schema/tablecompiler.js


import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import TableCompiler from '../../../schema/tablecompiler.js';

import _ from '../../../deps/lodash@4.17.15/index.js';
const filter = _.filter;
const values = _.values;

// Table Compiler
// -------

function TableCompiler_SQLite3() {
  TableCompiler.apply(this, arguments);
  this.primaryKey = void 0;
}
inherits(TableCompiler_SQLite3, TableCompiler);

// Create a new table.
TableCompiler_SQLite3.prototype.createQuery = function (columns, ifNot) {
  const createStatement = ifNot
    ? 'create table if not exists '
    : 'create table ';
  let sql = createStatement + this.tableName() + ' (' + columns.sql.join(', ');

  // SQLite forces primary keys to be added when the table is initially created
  // so we will need to check for a primary key commands and add the columns
  // to the table's declaration here so they can be created on the tables.
  sql += this.foreignKeys() || '';
  sql += this.primaryKeys() || '';
  sql += ')';

  this.pushQuery(sql);
};

TableCompiler_SQLite3.prototype.addColumns = function (columns, prefix) {
  if (prefix) {
    throw new Error('Sqlite does not support alter column.');
  }
  for (let i = 0, l = columns.sql.length; i < l; i++) {
    this.pushQuery({
      sql: `alter table ${this.tableName()} add column ${columns.sql[i]}`,
      bindings: columns.bindings[i],
    });
  }
};

// Compile a drop unique key command.
TableCompiler_SQLite3.prototype.dropUnique = function (columns, indexName) {
  indexName = indexName
    ? this.formatter.wrap(indexName)
    : this._indexCommand('unique', this.tableNameRaw, columns);
  this.pushQuery(`drop index ${indexName}`);
};

TableCompiler_SQLite3.prototype.dropIndex = function (columns, indexName) {
  indexName = indexName
    ? this.formatter.wrap(indexName)
    : this._indexCommand('index', this.tableNameRaw, columns);
  this.pushQuery(`drop index ${indexName}`);
};

// Compile a unique key command.
TableCompiler_SQLite3.prototype.unique = function (columns, indexName) {
  indexName = indexName
    ? this.formatter.wrap(indexName)
    : this._indexCommand('unique', this.tableNameRaw, columns);
  columns = this.formatter.columnize(columns);
  this.pushQuery(
    `create unique index ${indexName} on ${this.tableName()} (${columns})`
  );
};

// Compile a plain index key command.
TableCompiler_SQLite3.prototype.index = function (columns, indexName) {
  indexName = indexName
    ? this.formatter.wrap(indexName)
    : this._indexCommand('index', this.tableNameRaw, columns);
  columns = this.formatter.columnize(columns);
  this.pushQuery(
    `create index ${indexName} on ${this.tableName()} (${columns})`
  );
};

TableCompiler_SQLite3.prototype.primary = TableCompiler_SQLite3.prototype.foreign = function () {
  if (this.method !== 'create' && this.method !== 'createIfNot') {
    this.client.logger.warn(
      'SQLite3 Foreign & Primary keys may only be added on create'
    );
  }
};

TableCompiler_SQLite3.prototype.primaryKeys = function () {
  const pks = filter(this.grouped.alterTable || [], { method: 'primary' });
  if (pks.length > 0 && pks[0].args.length > 0) {
    const columns = pks[0].args[0];
    let constraintName = pks[0].args[1] || '';
    if (constraintName) {
      constraintName = ' constraint ' + this.formatter.wrap(constraintName);
    }
    return `,${constraintName} primary key (${this.formatter.columnize(
      columns
    )})`;
  }
};

TableCompiler_SQLite3.prototype.foreignKeys = function () {
  let sql = '';
  const foreignKeys = filter(this.grouped.alterTable || [], {
    method: 'foreign',
  });
  for (let i = 0, l = foreignKeys.length; i < l; i++) {
    const foreign = foreignKeys[i].args[0];
    const column = this.formatter.columnize(foreign.column);
    const references = this.formatter.columnize(foreign.references);
    const foreignTable = this.formatter.wrap(foreign.inTable);
    let constraintName = foreign.keyName || '';
    if (constraintName) {
      constraintName = ' constraint ' + this.formatter.wrap(constraintName);
    }
    sql += `,${constraintName} foreign key(${column}) references ${foreignTable}(${references})`;
    if (foreign.onDelete) sql += ` on delete ${foreign.onDelete}`;
    if (foreign.onUpdate) sql += ` on update ${foreign.onUpdate}`;
  }
  return sql;
};

TableCompiler_SQLite3.prototype.createTableBlock = function () {
  return this.getColumns().concat().join(',');
};

// Compile a rename column command... very complex in sqlite
TableCompiler_SQLite3.prototype.renameColumn = function (from, to) {
  const compiler = this;
  this.pushQuery({
    sql: `PRAGMA table_info(${this.tableName()})`,
    output(pragma) {
      return compiler.client
        .ddl(compiler, pragma, this.connection)
        .renameColumn(from, to);
    },
  });
};

TableCompiler_SQLite3.prototype.dropColumn = function () {
  const compiler = this;
  const columns = values(arguments);
  this.pushQuery({
    sql: `PRAGMA table_info(${this.tableName()})`,
    output(pragma) {
      return compiler.client
        .ddl(compiler, pragma, this.connection)
        .dropColumn(columns);
    },
  });
};

export default TableCompiler_SQLite3;
