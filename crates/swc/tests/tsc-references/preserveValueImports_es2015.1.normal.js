// @preserveValueImports: true
// @isolatedModules: true,false
// @module: esnext
// @Filename: a.ts
export default {};
export const b = 0;
export const c = 1;
// @Filename: b.ts
export { };
// @Filename: c.ts
export { };
// @Filename: d.ts
module.exports = {};
export { };
// @Filename: e.ts
const D = require("./d");
const DD = require("./d");
DD;
export { };
// @Filename: f.ts
import { b } from "./a";
b;
