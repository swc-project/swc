// @module: commonjs
// @Filename: vs/foo_0.ts
export var x;
// @Filename: foo_1.ts
const foo = require("vs/foo");
var z = foo.x + 10;
export { };
