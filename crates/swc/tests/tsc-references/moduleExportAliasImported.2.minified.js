//// [bug28014.js]
exports.version = 1, module.exports = function() {};
//// [importer.js]
import('./bug28014');
