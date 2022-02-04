function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
};
module.exports = Foo;
// @Filename: foo_1.ts
var foo = require("./foo_0");
var x = new foo();
var y = x.test;
// @module: commonjs
// @Filename: foo_0.ts
export { };
