//// [some-mod.d.ts]
export { };
//// [index.js]
var items = require("./some-mod")();
module.exports = items;
