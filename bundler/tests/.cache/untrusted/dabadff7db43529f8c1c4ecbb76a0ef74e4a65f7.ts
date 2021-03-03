// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/functionhelper.js


// FunctionHelper
// -------
function FunctionHelper(client) {
  this.client = client;
}

FunctionHelper.prototype.now = function (precision) {
  if (typeof precision === 'number') {
    return this.client.raw(`CURRENT_TIMESTAMP(${precision})`);
  }
  return this.client.raw('CURRENT_TIMESTAMP');
};

export default FunctionHelper;
