// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/schema/tablecompiler.js


/* eslint max-len:0 */

// Table Compiler
// -------
import { pushAdditional, pushQuery, unshiftQuery } from './helpers.js';
import helpers from '../helpers.js';
import _ from '../deps/lodash@4.17.15/index.js';
const groupBy = _.groupBy;
const indexOf = _.indexOf;
const isEmpty = _.isEmpty;
const tail = _.tail;

function TableCompiler(client, tableBuilder) {
  this.client = client;
  this.tableBuilder = tableBuilder;
  this._commonBuilder = this.tableBuilder;
  this.method = tableBuilder._method;
  this.schemaNameRaw = tableBuilder._schemaName;
  this.tableNameRaw = tableBuilder._tableName;
  this.single = tableBuilder._single;
  this.grouped = groupBy(tableBuilder._statements, 'grouping');
  this.formatter = client.formatter(tableBuilder);
  this.sequence = [];
  this._formatting = client.config && client.config.formatting;
}

TableCompiler.prototype.pushQuery = pushQuery;

TableCompiler.prototype.pushAdditional = pushAdditional;

TableCompiler.prototype.unshiftQuery = unshiftQuery;

// Convert the tableCompiler toSQL
TableCompiler.prototype.toSQL = function () {
  this[this.method]();
  return this.sequence;
};

TableCompiler.prototype.lowerCase = true;

// Column Compilation
// -------

// If this is a table "creation", we need to first run through all
// of the columns to build them into a single string,
// and then run through anything else and push it to the query sequence.
TableCompiler.prototype.createAlterTableMethods = null;
TableCompiler.prototype.create = function (ifNot) {
  const columnBuilders = this.getColumns();
  const columns = columnBuilders.map((col) => col.toSQL());
  const columnTypes = this.getColumnTypes(columns);
  if (this.createAlterTableMethods) {
    this.alterTableForCreate(columnTypes);
  }
  this.createQuery(columnTypes, ifNot);
  this.columnQueries(columns);
  delete this.single.comment;
  this.alterTable();
};

// Only create the table if it doesn't exist.
TableCompiler.prototype.createIfNot = function () {
  this.create(true);
};

// If we're altering the table, we need to one-by-one
// go through and handle each of the queries associated
// with altering the table's schema.
TableCompiler.prototype.alter = function () {
  const addColBuilders = this.getColumns();
  const addColumns = addColBuilders.map((col) => col.toSQL());
  const alterColBuilders = this.getColumns('alter');
  const alterColumns = alterColBuilders.map((col) => col.toSQL());
  const addColumnTypes = this.getColumnTypes(addColumns);
  const alterColumnTypes = this.getColumnTypes(alterColumns);

  this.addColumns(addColumnTypes);
  this.alterColumns(alterColumnTypes, alterColBuilders);
  this.columnQueries(addColumns);
  this.columnQueries(alterColumns);
  this.alterTable();
};

TableCompiler.prototype.foreign = function (foreignData) {
  if (foreignData.inTable && foreignData.references) {
    const keyName = foreignData.keyName
      ? this.formatter.wrap(foreignData.keyName)
      : this._indexCommand('foreign', this.tableNameRaw, foreignData.column);
    const column = this.formatter.columnize(foreignData.column);
    const references = this.formatter.columnize(foreignData.references);
    const inTable = this.formatter.wrap(foreignData.inTable);
    const onUpdate = foreignData.onUpdate
      ? (this.lowerCase ? ' on update ' : ' ON UPDATE ') + foreignData.onUpdate
      : '';
    const onDelete = foreignData.onDelete
      ? (this.lowerCase ? ' on delete ' : ' ON DELETE ') + foreignData.onDelete
      : '';
    if (this.lowerCase) {
      this.pushQuery(
        (!this.forCreate ? `alter table ${this.tableName()} add ` : '') +
          'constraint ' +
          keyName +
          ' ' +
          'foreign key (' +
          column +
          ') references ' +
          inTable +
          ' (' +
          references +
          ')' +
          onUpdate +
          onDelete
      );
    } else {
      this.pushQuery(
        (!this.forCreate ? `ALTER TABLE ${this.tableName()} ADD ` : '') +
          'CONSTRAINT ' +
          keyName +
          ' ' +
          'FOREIGN KEY (' +
          column +
          ') REFERENCES ' +
          inTable +
          ' (' +
          references +
          ')' +
          onUpdate +
          onDelete
      );
    }
  }
};

// Get all of the column sql & bindings individually for building the table queries.
TableCompiler.prototype.getColumnTypes = (columns) =>
  columns.reduce(
    function (memo, columnSQL) {
      const column = columnSQL[0];
      memo.sql.push(column.sql);
      memo.bindings.concat(column.bindings);
      return memo;
    },
    { sql: [], bindings: [] }
  );

// Adds all of the additional queries from the "column"
TableCompiler.prototype.columnQueries = function (columns) {
  const queries = columns.reduce(function (memo, columnSQL) {
    const column = tail(columnSQL);
    if (!isEmpty(column)) return memo.concat(column);
    return memo;
  }, []);
  for (const q of queries) {
    this.pushQuery(q);
  }
};

// Add a new column.
TableCompiler.prototype.addColumnsPrefix = 'add column ';

// All of the columns to "add" for the query
TableCompiler.prototype.addColumns = function (columns, prefix) {
  prefix = prefix || this.addColumnsPrefix;

  if (columns.sql.length > 0) {
    const columnSql = columns.sql.map((column) => {
      return prefix + column;
    });
    this.pushQuery({
      sql:
        (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
        this.tableName() +
        ' ' +
        columnSql.join(', '),
      bindings: columns.bindings,
    });
  }
};

// Alter column
TableCompiler.prototype.alterColumnsPrefix = 'alter column ';

TableCompiler.prototype.alterColumns = function (columns, colBuilders) {
  if (columns.sql.length > 0) {
    this.addColumns(columns, this.alterColumnsPrefix, colBuilders);
  }
};

// Compile the columns as needed for the current create or alter table
TableCompiler.prototype.getColumns = function (method) {
  const columns = this.grouped.columns || [];
  method = method || 'add';

  const queryContext = this.tableBuilder.queryContext();

  return columns
    .filter((column) => column.builder._method === method)
    .map((column) => {
      // pass queryContext down to columnBuilder but do not overwrite it if already set
      if (
        queryContext !== undefined &&
        column.builder.queryContext() === undefined
      ) {
        column.builder.queryContext(queryContext);
      }
      return this.client.columnCompiler(this, column.builder);
    });
};

TableCompiler.prototype.tableName = function () {
  const name = this.schemaNameRaw
    ? `${this.schemaNameRaw}.${this.tableNameRaw}`
    : this.tableNameRaw;

  return this.formatter.wrap(name);
};

// Generate all of the alter column statements necessary for the query.
TableCompiler.prototype.alterTable = function () {
  const alterTable = this.grouped.alterTable || [];
  for (let i = 0, l = alterTable.length; i < l; i++) {
    const statement = alterTable[i];
    if (this[statement.method]) {
      this[statement.method].apply(this, statement.args);
    } else {
      this.client.logger.error(`Debug: ${statement.method} does not exist`);
    }
  }
  for (const item in this.single) {
    if (typeof this[item] === 'function') this[item](this.single[item]);
  }
};

TableCompiler.prototype.alterTableForCreate = function (columnTypes) {
  this.forCreate = true;
  const savedSequence = this.sequence;
  const alterTable = this.grouped.alterTable || [];
  this.grouped.alterTable = [];
  for (let i = 0, l = alterTable.length; i < l; i++) {
    const statement = alterTable[i];
    if (indexOf(this.createAlterTableMethods, statement.method) < 0) {
      this.grouped.alterTable.push(statement);
      continue;
    }
    if (this[statement.method]) {
      this.sequence = [];
      this[statement.method].apply(this, statement.args);
      columnTypes.sql.push(this.sequence[0].sql);
    } else {
      this.client.logger.error(`Debug: ${statement.method} does not exist`);
    }
  }
  this.sequence = savedSequence;
  this.forCreate = false;
};

// Drop the index on the current table.
TableCompiler.prototype.dropIndex = function (value) {
  this.pushQuery(`drop index${value}`);
};

// Drop the unique
TableCompiler.prototype.dropUnique = TableCompiler.prototype.dropForeign = function () {
  throw new Error('Method implemented in the dialect driver');
};

TableCompiler.prototype.dropColumnPrefix = 'drop column ';
TableCompiler.prototype.dropColumn = function () {
  const columns = helpers.normalizeArr.apply(null, arguments);
  const drops = (Array.isArray(columns) ? columns : [columns]).map((column) => {
    return this.dropColumnPrefix + this.formatter.wrap(column);
  });
  this.pushQuery(
    (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
      this.tableName() +
      ' ' +
      drops.join(', ')
  );
};

// If no name was specified for this index, we will create one using a basic
// convention of the table name, followed by the columns, followed by an
// index type, such as primary or index, which makes the index unique.
TableCompiler.prototype._indexCommand = function (type, tableName, columns) {
  if (!Array.isArray(columns)) columns = columns ? [columns] : [];
  const table = tableName.replace(/\.|-/g, '_');
  const indexName = (
    table +
    '_' +
    columns.join('_') +
    '_' +
    type
  ).toLowerCase();
  return this.formatter.wrap(indexName);
};

export default TableCompiler;
