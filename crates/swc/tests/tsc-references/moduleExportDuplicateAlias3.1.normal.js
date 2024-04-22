//// [moduleExportAliasDuplicateAlias.js]
exports.apply = undefined;
exports.apply = undefined;
function a() {}
exports.apply = a;
exports.apply();
exports.apply = 'ok';
var OK = exports.apply.toUpperCase();
exports.apply = 1;
//// [test.js]
var apply = require('./moduleExportAliasDuplicateAlias').apply;
var result = apply.toFixed();
