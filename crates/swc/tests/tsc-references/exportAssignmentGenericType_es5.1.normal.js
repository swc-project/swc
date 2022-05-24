import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @module: commonjs
// @Filename: foo_0.ts
var Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
};
module.exports = Foo;
// @Filename: foo_1.ts
var foo = require("./foo_0");
var x = new foo();
var y = x.test;
export { };
