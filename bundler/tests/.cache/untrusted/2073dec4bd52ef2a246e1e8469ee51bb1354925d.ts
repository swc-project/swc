// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/mssql/schema/tablecompiler.js


/* eslint max-len:0 */

// MSSQL Table Builder & Compiler
// -------
import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import TableCompiler from '../../../schema/tablecompiler.js';
import helpers from '../../../helpers.js';

// Table Compiler
// ------

function TableCompiler_MSSQL() {
  TableCompiler.apply(this, arguments);
}
inherits(TableCompiler_MSSQL, TableCompiler);

Object.assign(TableCompiler_MSSQL.prototype, {
  createAlterTableMethods: ['foreign', 'primary'],
  createQuery(columns, ifNot) {
    const createStatement = ifNot
      ? `if object_id('${this.tableName()}', 'U') is null CREATE TABLE `
      : 'CREATE TABLE ';
    const sql =
      createStatement +
      this.tableName() +
      (this._formatting ? ' (\n    ' : ' (') +
      columns.sql.join(this._formatting ? ',\n    ' : ', ') +
      ')';

    if (this.single.comment) {
      const { comment } = this.single;
      if (comment.length > 60)
        this.client.logger.warn(
          'The max length for a table comment is 60 characters'
        );
    }

    this.pushQuery(sql);
  },

  lowerCase: false,

  addColumnsPrefix: 'ADD ',

  dropColumnPrefix: 'DROP COLUMN ',

  alterColumnPrefix: 'ALTER COLUMN ',

  // Compiles column add.  Multiple columns need only one ADD clause (not one ADD per column) so core addColumns doesn't work.  #1348
  addColumns(columns, prefix) {
    prefix = prefix || this.addColumnsPrefix;

    if (columns.sql.length > 0) {
      this.pushQuery({
        sql:
          (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
          this.tableName() +
          ' ' +
          prefix +
          columns.sql.join(', '),
        bindings: columns.bindings,
      });
    }
  },

  // Compiles column drop.  Multiple columns need only one DROP clause (not one DROP per column) so core dropColumn doesn't work.  #1348
  dropColumn() {
    const _this2 = this;
    const columns = helpers.normalizeArr.apply(null, arguments);

    const drops = (Array.isArray(columns) ? columns : [columns]).map((column) =>
      _this2.formatter.wrap(column)
    );
    this.pushQuery(
      (this.lowerCase ? 'alter table ' : 'ALTER TABLE ') +
        this.tableName() +
        ' ' +
        this.dropColumnPrefix +
        drops.join(', ')
    );
  },

  // Compiles the comment on the table.
  comment() {},

  changeType() {},

  // Renames a column on the table.
  renameColumn(from, to) {
    this.pushQuery(
      `exec sp_rename ${this.formatter.parameter(
        this.tableName() + '.' + from
      )}, ${this.formatter.parameter(to)}, 'COLUMN'`
    );
  },

  dropFKRefs(runner, refs) {
    const formatter = this.client.formatter(this.tableBuilder);
    return Promise.all(
      refs.map(function (ref) {
        const constraintName = formatter.wrap(ref.CONSTRAINT_NAME);
        const tableName = formatter.wrap(ref.TABLE_NAME);
        return runner.query({
          sql: `ALTER TABLE ${tableName} DROP CONSTRAINT ${constraintName}`,
        });
      })
    );
  },
  createFKRefs(runner, refs) {
    const formatter = this.client.formatter(this.tableBuilder);

    return Promise.all(
      refs.map(function (ref) {
        const tableName = formatter.wrap(ref.TABLE_NAME);
        const keyName = formatter.wrap(ref.CONSTRAINT_NAME);
        const column = formatter.columnize(ref.COLUMN_NAME);
        const references = formatter.columnize(ref.REFERENCED_COLUMN_NAME);
        const inTable = formatter.wrap(ref.REFERENCED_TABLE_NAME);
        const onUpdate = ` ON UPDATE ${ref.UPDATE_RULE}`;
        const onDelete = ` ON DELETE ${ref.DELETE_RULE}`;

        return runner.query({
          sql:
            `ALTER TABLE ${tableName} ADD CONSTRAINT ${keyName}` +
            ' FOREIGN KEY (' +
            column +
            ') REFERENCES ' +
            inTable +
            ' (' +
            references +
            ')' +
            onUpdate +
            onDelete,
        });
      })
    );
  },

  index(columns, indexName) {
    indexName = indexName
      ? this.formatter.wrap(indexName)
      : this._indexCommand('index', this.tableNameRaw, columns);
    this.pushQuery(
      `CREATE INDEX ${indexName} ON ${this.tableName()} (${this.formatter.columnize(
        columns
      )})`
    );
  },

  primary(columns, constraintName) {
    constraintName = constraintName
      ? this.formatter.wrap(constraintName)
      : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
    if (!this.forCreate) {
      this.pushQuery(
        `ALTER TABLE ${this.tableName()} ADD CONSTRAINT ${constraintName} PRIMARY KEY (${this.formatter.columnize(
          columns
        )})`
      );
    } else {
      this.pushQuery(
        `CONSTRAINT ${constraintName} PRIMARY KEY (${this.formatter.columnize(
          columns
        )})`
      );
    }
  },

  unique(columns, indexName) {
    indexName = indexName
      ? this.formatter.wrap(indexName)
      : this._indexCommand('unique', this.tableNameRaw, columns);

    if (!Array.isArray(columns)) {
      columns = [columns];
    }

    const whereAllTheColumnsAreNotNull = columns
      .map((column) => this.formatter.columnize(column) + ' IS NOT NULL')
      .join(' AND ');

    // make unique constraint that allows null https://stackoverflow.com/a/767702/360060
    // to be more or less compatible with other DBs (if any of the columns is NULL then "duplicates" are allowed)
    this.pushQuery(
      `CREATE UNIQUE INDEX ${indexName} ON ${this.tableName()} (${this.formatter.columnize(
        columns
      )}) WHERE ${whereAllTheColumnsAreNotNull}`
    );
  },

  // Compile a drop index command.
  dropIndex(columns, indexName) {
    indexName = indexName
      ? this.formatter.wrap(indexName)
      : this._indexCommand('index', this.tableNameRaw, columns);
    this.pushQuery(`DROP INDEX ${indexName} ON ${this.tableName()}`);
  },

  // Compile a drop foreign key command.
  dropForeign(columns, indexName) {
    indexName = indexName
      ? this.formatter.wrap(indexName)
      : this._indexCommand('foreign', this.tableNameRaw, columns);
    this.pushQuery(
      `ALTER TABLE ${this.tableName()} DROP CONSTRAINT ${indexName}`
    );
  },

  // Compile a drop primary key command.
  dropPrimary(constraintName) {
    constraintName = constraintName
      ? this.formatter.wrap(constraintName)
      : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
    this.pushQuery(
      `ALTER TABLE ${this.tableName()} DROP CONSTRAINT ${constraintName}`
    );
  },

  // Compile a drop unique key command.
  dropUnique(column, indexName) {
    indexName = indexName
      ? this.formatter.wrap(indexName)
      : this._indexCommand('unique', this.tableNameRaw, column);
    this.pushQuery(`DROP INDEX ${indexName} ON ${this.tableName()}`);
  },
});

export default TableCompiler_MSSQL;
