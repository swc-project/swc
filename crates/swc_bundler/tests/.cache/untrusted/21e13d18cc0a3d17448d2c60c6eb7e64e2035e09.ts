// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/mysql/schema/tablecompiler.js


/* eslint max-len:0 no-console:0*/

// MySQL Table Builder & Compiler
// -------
import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import TableCompiler from '../../../schema/tablecompiler.js';

// Table Compiler
// ------

function TableCompiler_MySQL() {
  TableCompiler.apply(this, arguments);
}

inherits(TableCompiler_MySQL, TableCompiler);

Object.assign(TableCompiler_MySQL.prototype, {
  createQuery(columns, ifNot) {
    const createStatement = ifNot
      ? 'create table if not exists '
      : 'create table ';
    const { client } = this;
    let conn = {};
    let sql =
      createStatement + this.tableName() + ' (' + columns.sql.join(', ') + ')';

    // Check if the connection settings are set.
    if (client.connectionSettings) {
      conn = client.connectionSettings;
    }

    const charset = this.single.charset || conn.charset || '';
    const collation = this.single.collate || conn.collate || '';
    const engine = this.single.engine || '';

    // var conn = builder.client.connectionSettings;
    if (charset) sql += ` default character set ${charset}`;
    if (collation) sql += ` collate ${collation}`;
    if (engine) sql += ` engine = ${engine}`;

    if (this.single.comment) {
      const comment = this.single.comment || '';
      if (comment.length > 60)
        this.client.logger.warn(
          'The max length for a table comment is 60 characters'
        );
      sql += ` comment = '${comment}'`;
    }

    this.pushQuery(sql);
  },

  addColumnsPrefix: 'add ',

  alterColumnsPrefix: 'modify ',

  dropColumnPrefix: 'drop ',

  // Compiles the comment on the table.
  comment(comment) {
    this.pushQuery(`alter table ${this.tableName()} comment = '${comment}'`);
  },

  changeType() {
    // alter table + table + ' modify ' + wrapped + '// type';
  },

  // Renames a column on the table.
  renameColumn(from, to) {
    const compiler = this;
    const table = this.tableName();
    const wrapped = this.formatter.wrap(from) + ' ' + this.formatter.wrap(to);

    this.pushQuery({
      sql:
        `show fields from ${table} where field = ` +
        this.formatter.parameter(from),
      output(resp) {
        const column = resp[0];
        const runner = this;
        return compiler.getFKRefs(runner).then(([refs]) =>
          new Promise((resolve, reject) => {
            try {
              if (!refs.length) {
                resolve();
              }
              resolve(compiler.dropFKRefs(runner, refs));
            } catch (e) {
              reject(e);
            }
          })
            .then(function () {
              let sql = `alter table ${table} change ${wrapped} ${column.Type}`;

              if (String(column.Null).toUpperCase() !== 'YES') {
                sql += ` NOT NULL`;
              } else {
                // This doesn't matter for most cases except Timestamp, where this is important
                sql += ` NULL`;
              }
              if (column.Default !== void 0 && column.Default !== null) {
                sql += ` DEFAULT '${column.Default}'`;
              }

              return runner.query({
                sql,
              });
            })
            .then(function () {
              if (!refs.length) {
                return;
              }
              return compiler.createFKRefs(
                runner,
                refs.map(function (ref) {
                  if (ref.REFERENCED_COLUMN_NAME === from) {
                    ref.REFERENCED_COLUMN_NAME = to;
                  }
                  if (ref.COLUMN_NAME === from) {
                    ref.COLUMN_NAME = to;
                  }
                  return ref;
                })
              );
            })
        );
      },
    });
  },

  getFKRefs(runner) {
    const formatter = this.client.formatter(this.tableBuilder);
    const sql =
      'SELECT KCU.CONSTRAINT_NAME, KCU.TABLE_NAME, KCU.COLUMN_NAME, ' +
      '       KCU.REFERENCED_TABLE_NAME, KCU.REFERENCED_COLUMN_NAME, ' +
      '       RC.UPDATE_RULE, RC.DELETE_RULE ' +
      'FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU ' +
      'JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS RC ' +
      '       USING(CONSTRAINT_NAME)' +
      'WHERE KCU.REFERENCED_TABLE_NAME = ' +
      formatter.parameter(this.tableNameRaw) +
      ' ' +
      '  AND KCU.CONSTRAINT_SCHEMA = ' +
      formatter.parameter(this.client.database()) +
      ' ' +
      '  AND RC.CONSTRAINT_SCHEMA = ' +
      formatter.parameter(this.client.database());

    return runner.query({
      sql,
      bindings: formatter.bindings,
    });
  },

  dropFKRefs(runner, refs) {
    const formatter = this.client.formatter(this.tableBuilder);

    return Promise.all(
      refs.map(function (ref) {
        const constraintName = formatter.wrap(ref.CONSTRAINT_NAME);
        const tableName = formatter.wrap(ref.TABLE_NAME);
        return runner.query({
          sql: `alter table ${tableName} drop foreign key ${constraintName}`,
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
            `alter table ${tableName} add constraint ${keyName} ` +
            'foreign key (' +
            column +
            ') references ' +
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
  index(columns, indexName, indexType) {
    indexName = indexName
      ? this.formatter.wrap(indexName)
      : this._indexCommand('index', this.tableNameRaw, columns);
    this.pushQuery(
      `alter table ${this.tableName()} add${
        indexType ? ` ${indexType}` : ''
      } index ${indexName}(${this.formatter.columnize(columns)})`
    );
  },

  primary(columns, constraintName) {
    constraintName = constraintName
      ? this.formatter.wrap(constraintName)
      : this.formatter.wrap(`${this.tableNameRaw}_pkey`);
    this.pushQuery(
      `alter table ${this.tableName()} add primary key ${constraintName}(${this.formatter.columnize(
        columns
      )})`
    );
  },

  unique(columns, indexName) {
    indexName = indexName
      ? this.formatter.wrap(indexName)
      : this._indexCommand('unique', this.tableNameRaw, columns);
    this.pushQuery(
      `alter table ${this.tableName()} add unique ${indexName}(${this.formatter.columnize(
        columns
      )})`
    );
  },

  // Compile a drop index command.
  dropIndex(columns, indexName) {
    indexName = indexName
      ? this.formatter.wrap(indexName)
      : this._indexCommand('index', this.tableNameRaw, columns);
    this.pushQuery(`alter table ${this.tableName()} drop index ${indexName}`);
  },

  // Compile a drop foreign key command.
  dropForeign(columns, indexName) {
    indexName = indexName
      ? this.formatter.wrap(indexName)
      : this._indexCommand('foreign', this.tableNameRaw, columns);
    this.pushQuery(
      `alter table ${this.tableName()} drop foreign key ${indexName}`
    );
  },

  // Compile a drop primary key command.
  dropPrimary() {
    this.pushQuery(`alter table ${this.tableName()} drop primary key`);
  },

  // Compile a drop unique key command.
  dropUnique(column, indexName) {
    indexName = indexName
      ? this.formatter.wrap(indexName)
      : this._indexCommand('unique', this.tableNameRaw, column);
    this.pushQuery(`alter table ${this.tableName()} drop index ${indexName}`);
  },
});

export default TableCompiler_MySQL;
