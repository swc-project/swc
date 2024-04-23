//// [moduleExportAliasDuplicateAlias.js]
module.exports.apply = undefined;
function a() {}
module.exports.apply = a;
module.exports.apply = a;
module.exports.apply();
//// [test.js]
var apply = require('./moduleExportAliasDuplicateAlias').apply;
apply();
