// @module: commonjs
// @Filename: foo_0.ts
class Foo {
}
// @Filename: foo_1.ts
const foo = require("./foo_0");
var x = new foo();
var y = x.test;
module.exports = Foo;
export { };
