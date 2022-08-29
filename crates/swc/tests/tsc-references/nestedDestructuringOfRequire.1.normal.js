//// [nestedDestructuringOfRequire.ts]
//// [mod1.js]
var chalk = {
    grey: {}
};
module.exports.chalk = chalk;
//// [main.js]
var ref = require("./mod1"), grey = ref.chalk.grey;
grey;
chalk;
