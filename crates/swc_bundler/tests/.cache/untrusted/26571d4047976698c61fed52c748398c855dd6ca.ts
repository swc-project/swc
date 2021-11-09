// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/redshift/schema/columncompiler.js


// Redshift Column Compiler
// -------

import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import ColumnCompiler_PG from '../../postgres/schema/columncompiler.js';

function ColumnCompiler_Redshift() {
  ColumnCompiler_PG.apply(this, arguments);
}
inherits(ColumnCompiler_Redshift, ColumnCompiler_PG);

Object.assign(ColumnCompiler_Redshift.prototype, {
  // Types:
  // ------
  bigincrements: 'bigint identity(1,1) primary key not null',
  binary: 'varchar(max)',
  bit(column) {
    return column.length !== false ? `char(${column.length})` : 'char(1)';
  },
  blob: 'varchar(max)',
  enu: 'varchar(255)',
  enum: 'varchar(255)',
  increments: 'integer identity(1,1) primary key not null',
  json: 'varchar(max)',
  jsonb: 'varchar(max)',
  longblob: 'varchar(max)',
  mediumblob: 'varchar(16777218)',
  set: 'text',
  text: 'varchar(max)',
  datetime(without) {
    return without ? 'timestamp' : 'timestamptz';
  },
  timestamp(without) {
    return without ? 'timestamp' : 'timestamptz';
  },
  tinyblob: 'varchar(256)',
  uuid: 'char(36)',
  varbinary: 'varchar(max)',
  bigint: 'bigint',
  bool: 'boolean',
  double: 'double precision',
  floating: 'real',
  smallint: 'smallint',
  tinyint: 'smallint',

  // Modifiers:
  // ------
  comment(comment) {
    this.pushAdditional(function () {
      this.pushQuery(
        `comment on column ${this.tableCompiler.tableName()}.` +
          this.formatter.wrap(this.args[0]) +
          ' is ' +
          (comment ? `'${comment}'` : 'NULL')
      );
    }, comment);
  },
});

export default ColumnCompiler_Redshift;
