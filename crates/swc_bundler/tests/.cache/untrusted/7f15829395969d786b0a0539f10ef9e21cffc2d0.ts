// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/postgres/schema/columncompiler.js


// PostgreSQL Column Compiler
// -------

import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import ColumnCompiler from '../../../schema/columncompiler.js';
import _ from '../../../deps/lodash@4.17.15/index.js';
const isObject = _.isObject;

function ColumnCompiler_PG() {
  ColumnCompiler.apply(this, arguments);
  this.modifiers = ['nullable', 'defaultTo', 'comment'];
}
inherits(ColumnCompiler_PG, ColumnCompiler);

Object.assign(ColumnCompiler_PG.prototype, {
  // Types
  // ------
  bigincrements: 'bigserial primary key',
  bigint: 'bigint',
  binary: 'bytea',

  bit(column) {
    return column.length !== false ? `bit(${column.length})` : 'bit';
  },

  bool: 'boolean',

  // Create the column definition for an enum type.
  // Using method "2" here: http://stackoverflow.com/a/10984951/525714
  enu(allowed, options) {
    options = options || {};

    const values =
      options.useNative && options.existingType
        ? undefined
        : allowed.join("', '");

    if (options.useNative) {
      let enumName = '';
      const schemaName = options.schemaName || this.tableCompiler.schemaNameRaw;

      if (schemaName) {
        enumName += `"${schemaName}".`;
      }

      enumName += `"${options.enumName}"`;

      if (!options.existingType) {
        this.tableCompiler.unshiftQuery(
          `create type ${enumName} as enum ('${values}')`
        );
      }

      return enumName;
    }
    return `text check (${this.formatter.wrap(this.args[0])} in ('${values}'))`;
  },

  double: 'double precision',
  decimal(precision, scale) {
    if (precision === null) return 'decimal';
    return `decimal(${this._num(precision, 8)}, ${this._num(scale, 2)})`;
  },
  floating: 'real',
  increments: 'serial primary key',
  json(jsonb) {
    if (jsonb) this.client.logger.deprecate('json(true)', 'jsonb()');
    return jsonColumn(this.client, jsonb);
  },
  jsonb() {
    return jsonColumn(this.client, true);
  },
  smallint: 'smallint',
  tinyint: 'smallint',
  datetime(withoutTz = false, precision) {
    let useTz;
    if (isObject(withoutTz)) {
      ({ useTz, precision } = withoutTz);
    } else {
      useTz = !withoutTz;
    }

    return `${useTz ? 'timestamptz' : 'timestamp'}${
      precision ? '(' + precision + ')' : ''
    }`;
  },
  timestamp(withoutTz = false, precision) {
    let useTz;
    if (isObject(withoutTz)) {
      ({ useTz, precision } = withoutTz);
    } else {
      useTz = !withoutTz;
    }

    return `${useTz ? 'timestamptz' : 'timestamp'}${
      precision ? '(' + precision + ')' : ''
    }`;
  },
  uuid: 'uuid',

  // Modifiers:
  // ------
  comment(comment) {
    const columnName = this.args[0] || this.defaults('columnName');

    this.pushAdditional(function () {
      this.pushQuery(
        `comment on column ${this.tableCompiler.tableName()}.` +
          this.formatter.wrap(columnName) +
          ' is ' +
          (comment ? `'${comment}'` : 'NULL')
      );
    }, comment);
  },
});

function jsonColumn(client, jsonb) {
  if (!client.version || parseFloat(client.version) >= 9.2)
    return jsonb ? 'jsonb' : 'json';
  return 'text';
}

export default ColumnCompiler_PG;
