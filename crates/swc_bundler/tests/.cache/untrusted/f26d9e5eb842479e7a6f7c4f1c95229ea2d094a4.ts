// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/mssql/query/compiler.js


// MSSQL Query Compiler
// ------
import QueryCompiler from '../../../query/compiler.js';

import _ from '../../../deps/lodash@4.17.15/index.js';
const compact = _.compact;
const identity = _.identity;
const isEmpty = _.isEmpty;

const components = [
  'columns',
  'join',
  'lock',
  'where',
  'union',
  'group',
  'having',
  'order',
  'limit',
  'offset',
];

class QueryCompiler_MSSQL extends QueryCompiler {
  constructor(client, builder) {
    super(client, builder);
    this._emptyInsertValue = 'default values';
  }

  select() {
    const sql = this.with();
    const statements = components.map((component) => this[component](this));
    return sql + compact(statements).join(' ');
  }

  // Compiles an "insert" query, allowing for multiple
  // inserts using a single query statement.
  insert() {
    const insertValues = this.single.insert || [];
    let sql = this.with() + `insert into ${this.tableName} `;
    const { returning } = this.single;
    const returningSql = returning
      ? this._returning('insert', returning) + ' '
      : '';

    if (Array.isArray(insertValues)) {
      if (insertValues.length === 0) {
        return '';
      }
    } else if (typeof insertValues === 'object' && isEmpty(insertValues)) {
      return {
        sql: sql + returningSql + this._emptyInsertValue,
        returning,
      };
    }

    const insertData = this._prepInsert(insertValues);
    if (typeof insertData === 'string') {
      sql += insertData;
    } else {
      if (insertData.columns.length) {
        sql += `(${this.formatter.columnize(insertData.columns)}`;
        sql += `) ${returningSql}values (`;
        let i = -1;
        while (++i < insertData.values.length) {
          if (i !== 0) sql += '), (';
          sql += this.formatter.parameterize(
            insertData.values[i],
            this.client.valueForUndefined
          );
        }
        sql += ')';
      } else if (insertValues.length === 1 && insertValues[0]) {
        sql += returningSql + this._emptyInsertValue;
      } else {
        sql = '';
      }
    }
    return {
      sql,
      returning,
    };
  }

  // Compiles an `update` query, allowing for a return value.
  update() {
    const top = this.top();
    const withSQL = this.with();
    const updates = this._prepUpdate(this.single.update);
    const join = this.join();
    const where = this.where();
    const order = this.order();
    const { returning } = this.single;
    return {
      sql:
        withSQL +
        `update ${top ? top + ' ' : ''}${this.tableName}` +
        ' set ' +
        updates.join(', ') +
        (returning ? ` ${this._returning('update', returning)}` : '') +
        (join ? ` from ${this.tableName} ${join}` : '') +
        (where ? ` ${where}` : '') +
        (order ? ` ${order}` : '') +
        (!returning ? this._returning('rowcount', '@@rowcount') : ''),
      returning: returning || '@@rowcount',
    };
  }

  // Compiles a `delete` query.
  del() {
    // Make sure tableName is processed by the formatter first.
    const withSQL = this.with();
    const { tableName } = this;
    const wheres = this.where();
    const { returning } = this.single;
    return {
      sql:
        withSQL +
        `delete from ${tableName}` +
        (returning ? ` ${this._returning('del', returning)}` : '') +
        (wheres ? ` ${wheres}` : '') +
        (!returning ? this._returning('rowcount', '@@rowcount') : ''),
      returning: returning || '@@rowcount',
    };
  }

  // Compiles the columns in the query, specifying if an item was distinct.
  columns() {
    let distinctClause = '';
    if (this.onlyUnions()) return '';
    const top = this.top();
    const columns = this.grouped.columns || [];
    let i = -1,
      sql = [];
    if (columns) {
      while (++i < columns.length) {
        const stmt = columns[i];
        if (stmt.distinct) distinctClause = 'distinct ';
        if (stmt.distinctOn) {
          distinctClause = this.distinctOn(stmt.value);
          continue;
        }
        if (stmt.type === 'aggregate') {
          sql.push(...this.aggregate(stmt));
        } else if (stmt.type === 'aggregateRaw') {
          sql.push(this.aggregateRaw(stmt));
        } else if (stmt.value && stmt.value.length > 0) {
          sql.push(this.formatter.columnize(stmt.value));
        }
      }
    }
    if (sql.length === 0) sql = ['*'];

    return (
      `select ${distinctClause}` +
      (top ? top + ' ' : '') +
      sql.join(', ') +
      (this.tableName ? ` from ${this.tableName}` : '')
    );
  }

  _returning(method, value) {
    switch (method) {
      case 'update':
      case 'insert':
        return value
          ? `output ${this.formatter.columnizeWithPrefix('inserted.', value)}`
          : '';
      case 'del':
        return value
          ? `output ${this.formatter.columnizeWithPrefix('deleted.', value)}`
          : '';
      case 'rowcount':
        return value ? ';select @@rowcount' : '';
    }
  }

  // Compiles a `truncate` query.
  truncate() {
    return `truncate table ${this.tableName}`;
  }

  forUpdate() {
    // this doesn't work exacltly as it should, one should also mention index while locking
    // https://stackoverflow.com/a/9818448/360060
    return 'with (UPDLOCK)';
  }

  forShare() {
    // http://www.sqlteam.com/article/introduction-to-locking-in-sql-server
    return 'with (HOLDLOCK)';
  }

  // Compiles a `columnInfo` query.
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

    let sql = `select * from information_schema.columns where table_name = ? and table_catalog = ?`;
    const bindings = [table, this.client.database()];

    if (schema) {
      sql += ' and table_schema = ?';
      bindings.push(schema);
    } else {
      sql += ` and table_schema = 'dbo'`;
    }

    return {
      sql,
      bindings: bindings,
      output(resp) {
        const out = resp.reduce(function (columns, val) {
          columns[val.COLUMN_NAME] = {
            defaultValue: val.COLUMN_DEFAULT,
            type: val.DATA_TYPE,
            maxLength: val.CHARACTER_MAXIMUM_LENGTH,
            nullable: val.IS_NULLABLE === 'YES',
          };
          return columns;
        }, {});
        return (column && out[column]) || out;
      },
    };
  }

  top() {
    const noLimit = !this.single.limit && this.single.limit !== 0;
    const noOffset = !this.single.offset;
    if (noLimit || !noOffset) return '';
    return `top (${this.formatter.parameter(this.single.limit)})`;
  }

  limit() {
    return '';
  }

  offset() {
    const noLimit = !this.single.limit && this.single.limit !== 0;
    const noOffset = !this.single.offset;
    if (noOffset) return '';
    let offset = `offset ${
      noOffset ? '0' : this.formatter.parameter(this.single.offset)
    } rows`;
    if (!noLimit) {
      offset += ` fetch next ${this.formatter.parameter(
        this.single.limit
      )} rows only`;
    }
    return offset;
  }
}

// Set the QueryBuilder & QueryCompiler on the client object,
// in case anyone wants to modify things to suit their own purposes.
export default QueryCompiler_MSSQL;
