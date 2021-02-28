// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/redshift/schema/columnbuilder.js


import inherits from '../../../deps/inherits@2.0.4/inherits.js';
import ColumnBuilder from '../../../schema/columnbuilder.js';

function ColumnBuilder_Redshift() {
  ColumnBuilder.apply(this, arguments);
}
inherits(ColumnBuilder_Redshift, ColumnBuilder);

// primary needs to set not null on non-preexisting columns, or fail
ColumnBuilder_Redshift.prototype.primary = function () {
  this.notNullable();
  return ColumnBuilder.prototype.primary.apply(this, arguments);
};

ColumnBuilder_Redshift.prototype.index = function () {
  this.client.logger.warn('Redshift does not support the creation of indexes.');
  return this;
};

export default ColumnBuilder_Redshift;
