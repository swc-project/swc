// @preserveValueImports: true
// @isolatedModules: true,false
// @module: esnext
// @Filename: a.ts
export default {};
export var b = 0;
export var c = 1;
// @Filename: e.ts
var D = require("./d");
var DD = require("./d");
DD;
b;
// @Filename: d.ts
module.exports = {};
