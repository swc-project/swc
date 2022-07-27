// @allowJs: true
// @checkJs: true
// @outDir: ./out
// @lib: es6
// @declaration: true
// @filename: some-mod.d.ts
module.exports = getItems;
export { };
// @filename: index.js
var items = require("./some-mod")();
module.exports = items;
