// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/mysql/schema/columncompiler.js


// MySQL Column Compiler
// -------
import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import ColumnCompiler from '../../../schema/columncompiler.js';

import _ from '../../../deps/lodash@4.17.15/index.js';
const isObject = _.isObject;

function ColumnCompiler_MySQL() {
  ColumnCompiler.apply(this, arguments);
  this.modifiers = [
    'unsigned',
    'nullable',
    'defaultTo',
    'comment',
    'collate',
    'first',
    'after',
  ];
}
inherits(ColumnCompiler_MySQL, ColumnCompiler);

// Types
// ------

Object.assign(ColumnCompiler_MySQL.prototype, {
  increments: 'int unsigned not null auto_increment primary key',

  bigincrements: 'bigint unsigned not null auto_increment primary key',

  bigint: 'bigint',

  double(precision, scale) {
    if (!precision) return 'double';
    return `double(${this._num(precision, 8)}, ${this._num(scale, 2)})`;
  },

  integer(length) {
    length = length ? `(${this._num(length, 11)})` : '';
    return `int${length}`;
  },

  mediumint: 'mediumint',

  smallint: 'smallint',

  tinyint(length) {
    length = length ? `(${this._num(length, 1)})` : '';
    return `tinyint${length}`;
  },

  text(column) {
    switch (column) {
      case 'medium':
      case 'mediumtext':
        return 'mediumtext';
      case 'long':
      case 'longtext':
        return 'longtext';
      default:
        return 'text';
    }
  },

  mediumtext() {
    return this.text('medium');
  },

  longtext() {
    return this.text('long');
  },

  enu(allowed) {
    return `enum('${allowed.join("', '")}')`;
  },

  datetime(precision) {
    if (isObject(precision)) {
      ({ precision } = precision);
    }

    return typeof precision === 'number'
      ? `datetime(${precision})`
      : 'datetime';
  },

  timestamp(precision) {
    if (isObject(precision)) {
      ({ precision } = precision);
    }

    return typeof precision === 'number'
      ? `timestamp(${precision})`
      : 'timestamp';
  },

  time(precision) {
    if (isObject(precision)) {
      ({ precision } = precision);
    }

    return typeof precision === 'number' ? `time(${precision})` : 'time';
  },

  bit(length) {
    return length ? `bit(${this._num(length)})` : 'bit';
  },

  binary(length) {
    return length ? `varbinary(${this._num(length)})` : 'blob';
  },

  json() {
    return 'json';
  },

  jsonb() {
    return 'json';
  },

  // Modifiers
  // ------

  defaultTo(value) {
    // MySQL defaults to null by default, but breaks down if you pass it explicitly
    // Note that in MySQL versions up to 5.7, logic related to updating
    // timestamps when no explicit value is passed is quite insane - https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_explicit_defaults_for_timestamp
    if (value === null || value === undefined) {
      return;
    }
    if ((this.type === 'json' || this.type === 'jsonb') && isObject(value)) {
      // Default value for json will work only it is an expression
      return `default ('${JSON.stringify(value)}')`;
    }
    const defaultVal = ColumnCompiler_MySQL.super_.prototype.defaultTo.apply(
      this,
      arguments
    );
    if (this.type !== 'blob' && this.type.indexOf('text') === -1) {
      return defaultVal;
    }
    return '';
  },

  unsigned() {
    return 'unsigned';
  },

  comment(comment) {
    if (comment && comment.length > 255) {
      this.client.logger.warn(
        'Your comment is longer than the max comment length for MySQL'
      );
    }
    return comment && `comment '${comment}'`;
  },

  first() {
    return 'first';
  },

  after(column) {
    return `after ${this.formatter.wrap(column)}`;
  },

  collate(collation) {
    return collation && `collate '${collation}'`;
  },
});

export default ColumnCompiler_MySQL;
