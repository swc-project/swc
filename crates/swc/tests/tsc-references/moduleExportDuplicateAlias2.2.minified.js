//// [moduleExportAliasDuplicateAlias.js]
module.exports.apply = void 0;
function a() {}
module.exports.apply = a;
module.exports.apply = a;
module.exports.apply();
//// [test.js]
(0, require("./moduleExportAliasDuplicateAlias").apply)();
