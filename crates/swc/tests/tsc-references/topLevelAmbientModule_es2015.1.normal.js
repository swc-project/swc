// @Filename: foo_1.ts
/// <reference path="foo_0.ts"/>
const foo = require("foo");
var z = foo.x + 10;
// @module: commonjs
// @Filename: foo_0.ts
export { };
