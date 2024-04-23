//// [requires.d.ts]
//// [mod1.js]
module.exports.bothBefore = 'string', module.exports = {
    justExport: 1,
    bothBefore: 2,
    bothAfter: 3
}, module.exports.bothAfter = 'string', module.exports.justProperty = 'string';
//// [a.js]
var mod1 = require('./mod1');
mod1.justExport.toFixed(), mod1.bothBefore.toFixed(), mod1.bothAfter.toFixed(), mod1.justProperty.length;
