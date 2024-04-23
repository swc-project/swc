//// [nestedDestructuringOfRequire.ts]
//// [mod1.js]
module.exports.chalk = {
    grey: {}
};
//// [main.js]
require('./mod1').chalk.grey, chalk;
