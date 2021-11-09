// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/mysql/schema/compiler.js


// MySQL Schema Compiler
// -------
import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import SchemaCompiler from '../../../schema/compiler.js';

import _ from '../../../deps/lodash@4.17.15/index.js';
const some = _.some;

function SchemaCompiler_MySQL(client, builder) {
  SchemaCompiler.call(this, client, builder);
}
inherits(SchemaCompiler_MySQL, SchemaCompiler);

Object.assign(SchemaCompiler_MySQL.prototype, {
  // Rename a table on the schema.
  renameTable(tableName, to) {
    this.pushQuery(
      `rename table ${this.formatter.wrap(tableName)} to ${this.formatter.wrap(
        to
      )}`
    );
  },

  // Check whether a table exists on the query.
  hasTable(tableName) {
    let sql = 'select * from information_schema.tables where table_name = ?';
    const bindings = [tableName];

    if (this.schema) {
      sql += ' and table_schema = ?';
      bindings.push(this.schema);
    } else {
      sql += ' and table_schema = database()';
    }

    this.pushQuery({
      sql,
      bindings,
      output: function output(resp) {
        return resp.length > 0;
      },
    });
  },

  // Check whether a column exists on the schema.
  hasColumn(tableName, column) {
    this.pushQuery({
      sql: `show columns from ${this.formatter.wrap(tableName)}`,
      output(resp) {
        return some(resp, (row) => {
          return (
            this.client.wrapIdentifier(row.Field) ===
            this.client.wrapIdentifier(column)
          );
        });
      },
    });
  },
});

export default SchemaCompiler_MySQL;
