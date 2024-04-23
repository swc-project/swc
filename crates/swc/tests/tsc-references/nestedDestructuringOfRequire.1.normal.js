//// [nestedDestructuringOfRequire.ts]
//// [mod1.js]
var chalk = {
    grey: {}
};
module.exports.chalk = chalk;
//// [main.js]
var _require = require('./mod1'), grey = _require.chalk.grey;
grey;
chalk;
