// @allowJs: true
// @checkJs: true
// @outDir: out
// @declaration: true
// @filename: mod1.js
var chalk = {
    grey: {
    }
};
module.exports.chalk = chalk;
// @filename: main.js
var ref = require('./mod1'), _chalk = ref.chalk, grey = _chalk.grey;
grey;
chalk;
