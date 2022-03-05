function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C(x1) {
    "use strict";
    _classCallCheck(this, C);
    this.a = x // error
    ;
};
var D = function D(x2) {
    "use strict";
    _classCallCheck(this, D);
    this.x = x2;
    this.a = x;
};
var E = function E(x) {
    "use strict";
    _classCallCheck(this, E);
    this.x = x;
    this.a = this.x;
};
var F = function F(x3) {
    "use strict";
    _classCallCheck(this, F);
    this.x = x3;
    this.a = this.x;
    this.b = x;
};
