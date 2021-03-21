// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/postgres/schema/tablecompiler.js


/* eslint max-len: 0 */

// PostgreSQL Table Builder & Compiler
// -------

import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import TableCompiler from '../../../schema/tablecompiler.js';

import _ from '../../../deps/lodash@4.17.15/index.js';
const has = _.has;

function TableCompiler_PG() {
  TableCompiler.apply(this, arguments);
}
inherits(TableCompiler_PG, TableCompiler);

// Compile a rename column command.
TableCompiler_PG.prototype.renameColumn = function (from, to) {
  return this.pushQuery({
    sql: `alter table ${this.tableName()} rename ${this.formatter.wrap(
      from
    )} to ${this.formatter.wrap(to)}`,
  });
};

TableCompiler_PG.prototype.compileAdd = function (builder) {
  const table = this.formatter.wrap(builder);
  const columns = this.prefixArray('add column', this.getColumns(builder));
  return this.pushQuery({
    sql: `alter table ${table} ${columns.join(', ')}`,
  });
};

// Adds the "create" query to the query sequence.
TableCompiler_PG.prototype.createQuery = function (columns, ifNot) {
  const createStatement = ifNot
    ? 'create table if not exists '
    : 'create table ';
  let sql =
    createStatement + this.tableName() + ' (' + columns.sql.join(', ') + ')';
  if (this.single.inherits)
    sql += ` inherits (${this.formatter.wrap(this.single.inherits)})`;
  this.pushQuery({
    sql,
    bindings: columns.bindings,
  });
  const hasComment = has(this.single, 'comment');
  if (hasComment) this.comment(this.single.comment);
};

TableCompiler_PG.prototype.addColumns = function (
  columns,
  prefix,
  colCompilers
) {
  if (prefix === this.alterColumnsPrefix) {
    // alter columns
    for (const col of colCompilers) {
      const quotedTableName = this.tableName();
      const type = col.getColumnType();
      // We'd prefer to call this.formatter.wrapAsIdentifier here instead, however the context passed to
      // `this` instance is not that of the column, but of the table. Thus, we unfortunately have to call
      // `wrapIdentifier` here as well (it is already called once on the initial column operation) to give
      // our `alter` operation the correct `queryContext`. Refer to issue #2606 and PR #2612.
      const colName = this.client.wrapIdentifier(
        col.getColumnName(),
        col.columnBuilder.queryContext()
      );

      this.pushQuery({
        sql: `alter table ${quotedTableName} alter column ${colName} drop default`,
        bindings: [],
      });
      this.pushQuery({
        sql: `alter table ${quotedTableName} alter column ${colName} drop not null`,
        bindings: [],
      });
      this.pushQuery({
        sql: `alter table ${quotedTableName} alter column ${colName} type ${type} using (${colName}::${type})`,
        bindings: [],
      });

      const defaultTo = col.modified['defaultTo'];
      if (defaultTo) {
        const modifier = col.defaultTo.apply(col, defaultTo);
        this.pushQuery({
          sql: `alter table ${quotedTableName} alter column ${colName} set ${modifier}`,
          bindings: [],
        });
      }

      const nullable = col.modified['nullable'];
      if (nullable && nullable[0] === false) {
        this.pushQuery({
          sql: `alter table ${quotedTableName} alter column ${colName} set not null`,
          bindings: [],
        });
      }
    }
  } else {
    // base class implementation for normal add
    TableCompiler.prototype.addColumns.call(this, columns, prefix);
  }
};

// Compiles the comment on the table.
TableCompiler_PG.prototype.comment = function (comment) {
  this.pushQuery(
    `comment on table ${this.tableName()} is '${this.single.comment}'`
  );
};

// Indexes:
// -------

TableCompiler_PG.prototype.primary = function (columns, constraintName) {
  constraintName = constraintName
    ? this.formatter.wrap(constraintName)
    : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
  this.pushQuery(
    `alter table ${this.tableName()} add constraint ${constraintName} primary key (${this.formatter.columnize(
      columns
    )})`
  );
};
TableCompiler_PG.prototype.unique = function (columns, indexName) {
  indexName = indexName
    ? this.formatter.wrap(indexName)
    : this._indexCommand('unique', this.tableNameRaw, columns);
  this.pushQuery(
    `alter table ${this.tableName()} add constraint ${indexName}` +
      ' unique (' +
      this.formatter.columnize(columns) +
      ')'
  );
};
TableCompiler_PG.prototype.index = function (columns, indexName, indexType) {
  indexName = indexName
    ? this.formatter.wrap(indexName)
    : this._indexCommand('index', this.tableNameRaw, columns);
  this.pushQuery(
    `create index ${indexName} on ${this.tableName()}${
      (indexType && ` using ${indexType}`) || ''
    }` +
      ' (' +
      this.formatter.columnize(columns) +
      ')'
  );
};
TableCompiler_PG.prototype.dropPrimary = function (constraintName) {
  constraintName = constraintName
    ? this.formatter.wrap(constraintName)
    : this.formatter.wrap(this.tableNameRaw + '_pkey');
  this.pushQuery(
    `alter table ${this.tableName()} drop constraint ${constraintName}`
  );
};
TableCompiler_PG.prototype.dropIndex = function (columns, indexName) {
  indexName = indexName
    ? this.formatter.wrap(indexName)
    : this._indexCommand('index', this.tableNameRaw, columns);
  indexName = this.schemaNameRaw
    ? `${this.formatter.wrap(this.schemaNameRaw)}.${indexName}`
    : indexName;
  this.pushQuery(`drop index ${indexName}`);
};
TableCompiler_PG.prototype.dropUnique = function (columns, indexName) {
  indexName = indexName
    ? this.formatter.wrap(indexName)
    : this._indexCommand('unique', this.tableNameRaw, columns);
  this.pushQuery(
    `alter table ${this.tableName()} drop constraint ${indexName}`
  );
};
TableCompiler_PG.prototype.dropForeign = function (columns, indexName) {
  indexName = indexName
    ? this.formatter.wrap(indexName)
    : this._indexCommand('foreign', this.tableNameRaw, columns);
  this.pushQuery(
    `alter table ${this.tableName()} drop constraint ${indexName}`
  );
};

export default TableCompiler_PG;
