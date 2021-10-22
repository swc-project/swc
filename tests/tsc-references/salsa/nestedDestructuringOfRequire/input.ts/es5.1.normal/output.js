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
var ref = require('./mod1'), grey = ref.chalk.grey;
grey;
chalk;
