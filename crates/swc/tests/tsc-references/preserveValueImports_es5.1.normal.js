// @preserveValueImports: true
// @isolatedModules: true,false
// @module: esnext
// @Filename: a.ts
// @Filename: b.ts
import { D } from "./a";
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
