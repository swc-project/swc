function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    this.x = 1;
    this.y = 'hello';
};
var c = new C();
var c2 = new C(null); // error
var D = function D() {
    "use strict";
    _classCallCheck(this, D);
    this.x = 2;
    this.y = null;
};
var d = new D();
var d2 = new D(null); // error
