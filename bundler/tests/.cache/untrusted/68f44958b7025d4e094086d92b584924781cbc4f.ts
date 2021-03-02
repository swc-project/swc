// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/oracle/schema/columnbuilder.js


import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import ColumnBuilder from '../../../schema/columnbuilder.js';

import _ from '../../../deps/lodash@4.17.15/index.js';
const toArray = _.toArray;

function ColumnBuilder_Oracle() {
  ColumnBuilder.apply(this, arguments);
}
inherits(ColumnBuilder_Oracle, ColumnBuilder);

// checkIn added to the builder to allow the column compiler to change the
// order via the modifiers ("check" must be after "default")
ColumnBuilder_Oracle.prototype.checkIn = function () {
  this._modifiers.checkIn = toArray(arguments);
  return this;
};

export default ColumnBuilder_Oracle;
