function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var _method = new WeakSet();
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    _method.add(this);
};
function method() {
    return 42;
}
C.s = new C().#method();
console.log(C.s);
