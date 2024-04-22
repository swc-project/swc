//// [moduleExportAliasDuplicateAlias.js]
function a() {}
module.exports.apply = void 0, module.exports.apply = a, module.exports.apply = a, module.exports.apply();
//// [test.js]
(0, require('./moduleExportAliasDuplicateAlias').apply)();
