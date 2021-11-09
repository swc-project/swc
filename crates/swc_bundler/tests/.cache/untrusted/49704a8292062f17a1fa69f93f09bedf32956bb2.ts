// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/dialects/oracledb/utils.js


import Utils from '../oracle/utils.js';

export function BlobHelper(columnName, value) {
  this.columnName = columnName;
  this.value = value;
  this.returning = false;
}

BlobHelper.prototype.toString = function () {
  return '[object BlobHelper:' + this.columnName + ']';
};

Utils.BlobHelper = BlobHelper;
export default Utils;
