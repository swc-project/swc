// @module: commonjs
// @Filename: foo_0.ts
class Foo {
    constructor(x1){
    }
}
module.exports = Foo;
// @Filename: foo_1.ts
const foo = require("./foo_0");
var x = new foo(true); // Should error
var y = new foo({
    a: "test",
    b: 42
}); // Should be OK
var z = y.test.b;
export { };
