import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @module: commonjs
// @Filename: foo_0.ts
var Foo = function Foo(x) {
    "use strict";
    _class_call_check(this, Foo);
};
// @Filename: foo_1.ts
var foo = require("./foo_0");
var x = new foo(true); // Should error
var y = new foo({
    a: "test",
    b: 42
}); // Should be OK
var z = y.test.b;
module.exports = Foo;
export { };
