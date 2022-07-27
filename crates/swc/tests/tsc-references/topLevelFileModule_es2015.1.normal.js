// @module: commonjs
// @Filename: vs/foo_0.ts
export var x;
// @Filename: vs/fum.d.ts
export { };
// @Filename: foo_1.ts
const foo = require("./vs/foo_0");
const fum = require("./vs/fum");
var z = foo.x + fum.y;
export { };
