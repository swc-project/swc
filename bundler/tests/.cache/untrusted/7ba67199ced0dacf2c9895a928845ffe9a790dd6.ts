// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/mssql/schema/columncompiler.js


// MySQL Column Compiler
// -------
import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import ColumnCompiler from '../../../schema/columncompiler.js';

function ColumnCompiler_MSSQL() {
  ColumnCompiler.apply(this, arguments);
  this.modifiers = ['nullable', 'defaultTo', 'first', 'after', 'comment'];
}
inherits(ColumnCompiler_MSSQL, ColumnCompiler);

// Types
// ------

Object.assign(ColumnCompiler_MSSQL.prototype, {
  increments: 'int identity(1,1) not null primary key',

  bigincrements: 'bigint identity(1,1) not null primary key',

  bigint: 'bigint',

  double(precision, scale) {
    return 'float';
  },

  floating(precision, scale) {
    // ignore precicion / scale which is mysql specific stuff
    return `float`;
  },

  integer() {
    // mssql does not support length
    return 'int';
  },

  mediumint: 'int',

  smallint: 'smallint',

  tinyint() {
    // mssql does not support length
    return 'tinyint';
  },

  varchar(length) {
    return `nvarchar(${this._num(length, 255)})`;
  },

  text: 'nvarchar(max)',

  mediumtext: 'nvarchar(max)',

  longtext: 'nvarchar(max)',

  // TODO: mssql supports check constraints as of SQL Server 2008
  // so make enu here more like postgres
  enu: 'nvarchar(100)',

  uuid: 'uniqueidentifier',

  datetime: 'datetime2',

  timestamp({ useTz = false } = {}) {
    return useTz ? 'datetimeoffset' : 'datetime2';
  },

  bit(length) {
    if (length > 1) {
      this.client.logger.warn('Bit field is exactly 1 bit length for MSSQL');
    }
    return 'bit';
  },

  binary(length) {
    return length ? `varbinary(${this._num(length)})` : 'varbinary(max)';
  },

  bool: 'bit',

  // Modifiers
  // ------

  first() {
    this.client.logger.warn('Column first modifier not available for MSSQL');
    return '';
  },

  after(column) {
    this.client.logger.warn('Column after modifier not available for MSSQL');
    return '';
  },

  comment(comment) {
    if (comment && comment.length > 255) {
      this.client.logger.warn(
        'Your comment is longer than the max comment length for MSSQL'
      );
    }
    return '';
  },
});

export default ColumnCompiler_MSSQL;
