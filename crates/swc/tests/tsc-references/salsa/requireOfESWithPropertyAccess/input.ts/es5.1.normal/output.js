// @allowJs: true
// @checkJs: true
// @strict: true
// @outDir: out
// @declaration: true
// @filename: main.js
var x = require('./ch').x;
x;
x.grey;
x.x.grey;
// @filename: ch.js
var x = {
    grey: {
    }
};
export { x };
