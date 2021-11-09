// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/redshift/query/compiler.js


// Redshift Query Builder & Compiler
// ------
import QueryCompiler from '../../../query/compiler.js';
import QueryCompiler_PG from '../../postgres/query/compiler.js';

import _ from '../../../deps/lodash@4.17.15/index.js';
const identity = _.identity;
const reduce = _.reduce;

class QueryCompiler_Redshift extends QueryCompiler_PG {
  constructor(client, builder) {
    super(client, builder);
  }

  truncate() {
    return `truncate ${this.tableName.toLowerCase()}`;
  }

  // Compiles an `insert` query, allowing for multiple
  // inserts using a single query statement.
  insert() {
    const sql = QueryCompiler.prototype.insert.apply(this, arguments);
    if (sql === '') return sql;
    this._slightReturn();
    return {
      sql,
    };
  }

  // Compiles an `update` query, warning on unsupported returning
  update() {
    const sql = QueryCompiler.prototype.update.apply(this, arguments);
    this._slightReturn();
    return {
      sql,
    };
  }

  // Compiles an `delete` query, warning on unsupported returning
  del() {
    const sql = QueryCompiler.prototype.del.apply(this, arguments);
    this._slightReturn();
    return {
      sql,
    };
  }

  // simple: if trying to return, warn
  _slightReturn() {
    if (this.single.isReturning) {
      this.client.logger.warn(
        'insert/update/delete returning is not supported by redshift dialect'
      );
    }
  }

  forUpdate() {
    this.client.logger.warn('table lock is not supported by redshift dialect');
    return '';
  }

  forShare() {
    this.client.logger.warn(
      'lock for share is not supported by redshift dialect'
    );
    return '';
  }

  // Compiles a columnInfo query
  columnInfo() {
    const column = this.single.columnInfo;
    let schema = this.single.schema;

    // The user may have specified a custom wrapIdentifier function in the config. We
    // need to run the identifiers through that function, but not format them as
    // identifiers otherwise.
    const table = this.client.customWrapIdentifier(this.single.table, identity);

    if (schema) {
      schema = this.client.customWrapIdentifier(schema, identity);
    }

    let sql =
      'select * from information_schema.columns where table_name = ? and table_catalog = ?';
    const bindings = [
      table.toLowerCase(),
      this.client.database().toLowerCase(),
    ];

    if (schema) {
      sql += ' and table_schema = ?';
      bindings.push(schema);
    } else {
      sql += ' and table_schema = current_schema()';
    }

    return {
      sql,
      bindings,
      output(resp) {
        const out = reduce(
          resp.rows,
          function (columns, val) {
            columns[val.column_name] = {
              type: val.data_type,
              maxLength: val.character_maximum_length,
              nullable: val.is_nullable === 'YES',
              defaultValue: val.column_default,
            };
            return columns;
          },
          {}
        );
        return (column && out[column]) || out;
      },
    };
  }
}

export default QueryCompiler_Redshift;
