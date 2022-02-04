function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _fooMethod = new WeakSet(), _fooProp = new WeakSet(), _fooProp = new WeakSet();
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
    _fooField.set(this, {
        writable: true,
        value: 3
    });
    _fooMethod.add(this);
    _fooProp.add(this);
    _fooProp.add(this);
    // @strict: true
    // @target: es6
    this.bar = 3;
    this.baz = 3;
};
var _fooField = new WeakMap();
function fooMethod() {}
function fooProp() {
    return 1;
}
function fooProp(value) {}
// `keyof A` should not include '#foo*'
var k = "bar"; // OK
k = "baz"; // OK
k = "#fooField"; // Error
k = "#fooMethod"; // Error
k = "#fooProp"; // Error
k = "fooField"; // Error
k = "fooMethod"; // Error
k = "fooProp"; // Error
