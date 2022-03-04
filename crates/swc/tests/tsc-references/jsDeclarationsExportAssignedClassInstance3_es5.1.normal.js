function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Foo = function Foo() {
    "use strict";
    _classCallCheck(this, Foo);
    this.member = 10;
};
Foo.stat = 10;
module.exports = new Foo();
module.exports.additional = 20;
