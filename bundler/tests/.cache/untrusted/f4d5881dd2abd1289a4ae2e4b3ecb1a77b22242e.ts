// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/mysql/query/compiler.js


// MySQL Query Compiler
// ------
import QueryCompiler from '../../../query/compiler.js';

import _ from '../../../deps/lodash@4.17.15/index.js';
const identity = _.identity;

class QueryCompiler_MySQL extends QueryCompiler {
  constructor(client, builder) {
    super(client, builder);

    const { returning } = this.single;

    if (returning) {
      this.client.logger.warn(
        '.returning() is not supported by mysql and will not have any effect.'
      );
    }
    this._emptyInsertValue = '() values ()';
  }

  // Update method, including joins, wheres, order & limits.
  update() {
    const join = this.join();
    const updates = this._prepUpdate(this.single.update);
    const where = this.where();
    const order = this.order();
    const limit = this.limit();
    return (
      `update ${this.tableName}` +
      (join ? ` ${join}` : '') +
      ' set ' +
      updates.join(', ') +
      (where ? ` ${where}` : '') +
      (order ? ` ${order}` : '') +
      (limit ? ` ${limit}` : '')
    );
  }

  forUpdate() {
    return 'for update';
  }

  forShare() {
    return 'lock in share mode';
  }

  // Only supported on MySQL 8.0+
  skipLocked() {
    return 'skip locked';
  }

  // Supported on MySQL 8.0+ and MariaDB 10.3.0+
  noWait() {
    return 'nowait';
  }

  // Compiles a `columnInfo` query.
  columnInfo() {
    const column = this.single.columnInfo;

    // The user may have specified a custom wrapIdentifier function in the config. We
    // need to run the identifiers through that function, but not format them as
    // identifiers otherwise.
    const table = this.client.customWrapIdentifier(this.single.table, identity);

    return {
      sql:
        'select * from information_schema.columns where table_name = ? and table_schema = ?',
      bindings: [table, this.client.database()],
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

  limit() {
    const noLimit = !this.single.limit && this.single.limit !== 0;
    if (noLimit && !this.single.offset) return '';

    // Workaround for offset only.
    // see: http://stackoverflow.com/questions/255517/mysql-offset-infinite-rows
    const limit =
      this.single.offset && noLimit
        ? '18446744073709551615'
        : this.formatter.parameter(this.single.limit);
    return `limit ${limit}`;
  }
}

// Set the QueryBuilder & QueryCompiler on the client object,
// in case anyone wants to modify things to suit their own purposes.
export default QueryCompiler_MySQL;
