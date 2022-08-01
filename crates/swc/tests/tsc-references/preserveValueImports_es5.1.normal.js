// @preserveValueImports: true
// @isolatedModules: true,false
// @module: esnext
// @Filename: a.ts
export default {};
export var b = 0;
export var c = 1;
// @Filename: b.ts
export { };
// @Filename: c.ts
export { };
// @Filename: d.ts
module.exports = {};
export { };
// @Filename: e.ts
var D = require("./d");
var DD = require("./d");
DD;
export { };
// @Filename: f.ts
import { b } from "./a";
b;
