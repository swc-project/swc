// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/oracledb/schema/columncompiler.js


import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import ColumnCompiler_Oracle from '../../oracle/schema/columncompiler.js';

import _ from '../../../deps/lodash@4.17.15/index.js';
const isObject = _.isObject;

function ColumnCompiler_Oracledb() {
  ColumnCompiler_Oracle.apply(this, arguments);
}

inherits(ColumnCompiler_Oracledb, ColumnCompiler_Oracle);

Object.assign(ColumnCompiler_Oracledb.prototype, {
  time: 'timestamp with local time zone',

  datetime: function (withoutTz) {
    let useTz;
    if (isObject(withoutTz)) {
      ({ useTz } = withoutTz);
    } else {
      useTz = !withoutTz;
    }
    return useTz ? 'timestamp with local time zone' : 'timestamp';
  },

  timestamp: function (withoutTz) {
    let useTz;
    if (isObject(withoutTz)) {
      ({ useTz } = withoutTz);
    } else {
      useTz = !withoutTz;
    }
    return useTz ? 'timestamp with local time zone' : 'timestamp';
  },
});

export default ColumnCompiler_Oracledb;
