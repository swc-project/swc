function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C(x) {
    "use strict";
    _classCallCheck(this, C);
};
var c = new C(1);
var c = new C(new C('')); // error
