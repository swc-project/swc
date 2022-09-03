//// [bug28014.js]
function alias() {}
exports.version = 1, module.exports = alias;
//// [importer.js]
import('./bug28014');
