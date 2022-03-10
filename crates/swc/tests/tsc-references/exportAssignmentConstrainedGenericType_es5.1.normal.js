import * as swcHelpers from "@swc/helpers";
// @module: commonjs
// @Filename: foo_0.ts
var Foo = function Foo(x) {
    "use strict";
    swcHelpers.classCallCheck(this, Foo);
};
module.exports = Foo;
// @Filename: foo_1.ts
var foo = require("./foo_0");
var x = new foo(true); // Should error
var y = new foo({
    a: "test",
    b: 42
}); // Should be OK
var z = y.test.b;
export { };
