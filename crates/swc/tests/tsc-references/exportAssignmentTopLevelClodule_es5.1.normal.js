function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
    // @module: amd
    // @Filename: foo_0.ts
    this.test = "test";
};
(function(Foo) {
    Foo.answer = 42;
})(Foo || (Foo = {
}));
module.exports = Foo;
// @Filename: foo_1.ts
var foo = require("./foo_0");
if (foo.answer === 42) {
    var x = new foo();
}
export { };
