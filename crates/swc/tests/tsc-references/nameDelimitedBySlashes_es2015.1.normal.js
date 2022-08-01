// @module: commonjs
// @Filename: test/foo_0.ts
export var foo = 42;
// @Filename: foo_1.ts
const foo = require('./test/foo_0');
var x = foo.foo + 42;
export { };
