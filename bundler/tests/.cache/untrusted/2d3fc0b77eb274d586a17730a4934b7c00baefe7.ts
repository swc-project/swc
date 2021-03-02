// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/redshift/schema/tablecompiler.js


/* eslint max-len: 0 */

// Redshift Table Builder & Compiler
// -------

import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import _ from '../../../deps/lodash@4.17.15/index.js';
const has = _.has;
import TableCompiler_PG from '../../postgres/schema/tablecompiler.js';

function TableCompiler_Redshift() {
  TableCompiler_PG.apply(this, arguments);
}
inherits(TableCompiler_Redshift, TableCompiler_PG);

TableCompiler_Redshift.prototype.index = function (
  columns,
  indexName,
  indexType
) {
  this.client.logger.warn('Redshift does not support the creation of indexes.');
};

TableCompiler_Redshift.prototype.dropIndex = function (columns, indexName) {
  this.client.logger.warn('Redshift does not support the deletion of indexes.');
};

// TODO: have to disable setting not null on columns that already exist...

// Adds the "create" query to the query sequence.
TableCompiler_Redshift.prototype.createQuery = function (columns, ifNot) {
  const createStatement = ifNot
    ? 'create table if not exists '
    : 'create table ';
  let sql =
    createStatement + this.tableName() + ' (' + columns.sql.join(', ') + ')';
  if (this.single.inherits)
    sql += ` like (${this.formatter.wrap(this.single.inherits)})`;
  this.pushQuery({
    sql,
    bindings: columns.bindings,
  });
  const hasComment = has(this.single, 'comment');
  if (hasComment) this.comment(this.single.comment);
};

TableCompiler_Redshift.prototype.primary = function (columns, constraintName) {
  const self = this;
  constraintName = constraintName
    ? self.formatter.wrap(constraintName)
    : self.formatter.wrap(`${this.tableNameRaw}_pkey`);
  if (columns.constructor !== Array) {
    columns = [columns];
  }
  const thiscolumns = self.grouped.columns;

  if (thiscolumns) {
    for (let i = 0; i < columns.length; i++) {
      let exists = thiscolumns.find(
        (tcb) =>
          tcb.grouping === 'columns' &&
          tcb.builder &&
          tcb.builder._method === 'add' &&
          tcb.builder._args &&
          tcb.builder._args.indexOf(columns[i]) > -1
      );
      if (exists) {
        exists = exists.builder;
      }
      const nullable = !(
        exists &&
        exists._modifiers &&
        exists._modifiers['nullable'] &&
        exists._modifiers['nullable'][0] === false
      );
      if (nullable) {
        if (exists) {
          return this.client.logger.warn(
            'Redshift does not allow primary keys to contain nullable columns.'
          );
        } else {
          return this.client.logger.warn(
            'Redshift does not allow primary keys to contain nonexistent columns.'
          );
        }
      }
    }
  }
  return self.pushQuery(
    `alter table ${self.tableName()} add constraint ${constraintName} primary key (${self.formatter.columnize(
      columns
    )})`
  );
};

// Compiles column add. Redshift can only add one column per ALTER TABLE, so core addColumns doesn't work.  #2545
TableCompiler_Redshift.prototype.addColumns = function (
  columns,
  prefix,
  colCompilers
) {
  if (prefix === this.alterColumnsPrefix) {
    TableCompiler_PG.prototype.addColumns.call(
      this,
      columns,
      prefix,
      colCompilers
    );
  } else {
    prefix = prefix || this.addColumnsPrefix;
    colCompilers = colCompilers || this.getColumns();
    for (const col of colCompilers) {
      const quotedTableName = this.tableName();
      const colCompiled = col.compileColumn();

      this.pushQuery({
        sql: `alter table ${quotedTableName} ${prefix}${colCompiled}`,
        bindings: [],
      });
    }
  }
};

export default TableCompiler_Redshift;
