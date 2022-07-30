// @module: commonjs
// @target: es5
// @filename: t1.ts
let as = 100;
export { as as return, as };
// @filename: t2.ts 
import * as as from "./t1";
var x = as.as;
var y = as.return;
// @filename: t3.ts 
export { };
// @filename: t4.ts 
export { };
