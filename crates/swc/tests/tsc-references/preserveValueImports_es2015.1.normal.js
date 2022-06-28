// @Filename: b.ts
import { D } from "./a";
// @preserveValueImports: true
// @isolatedModules: true,false
// @module: esnext
// @Filename: a.ts
export default {};
export const b = 0;
export const c = 1;
// @Filename: e.ts
const D = require("./d");
const DD = require("./d");
DD;
b;
// @Filename: d.ts
module.exports = {};
