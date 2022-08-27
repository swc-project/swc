//// [bug28014.js]
exports.version = 1;
function alias() {}
module.exports = alias;
//// [importer.js]
import('./bug28014');
