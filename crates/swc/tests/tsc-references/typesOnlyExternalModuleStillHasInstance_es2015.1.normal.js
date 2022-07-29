// @module: commonjs
// @Filename: foo_0.ts
export { };
// @Filename: foo_1.ts
const foo0 = require('./foo_0');
// Per 11.2.3, foo_0 should still be "instantiated", albeit with no members
var x = {};
var y = foo0;
export { };
