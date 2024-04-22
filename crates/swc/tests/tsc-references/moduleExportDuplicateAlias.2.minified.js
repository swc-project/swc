//// [moduleExportAliasDuplicateAlias.js]
exports.apply = void 0, exports.apply(), exports.apply = function() {}, exports.apply();
//// [test.js]
(0, require('./moduleExportAliasDuplicateAlias').apply)();
