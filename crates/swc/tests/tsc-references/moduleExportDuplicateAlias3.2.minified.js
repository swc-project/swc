//// [moduleExportAliasDuplicateAlias.js]
exports.apply = void 0, exports.apply = void 0, exports.apply = function() {}, exports.apply(), exports.apply = 'ok', exports.apply.toUpperCase(), exports.apply = 1;
//// [test.js]
require('./moduleExportAliasDuplicateAlias').apply.toFixed();
