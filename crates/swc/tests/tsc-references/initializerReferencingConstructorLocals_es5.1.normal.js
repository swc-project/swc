function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C(x) {
    "use strict";
    _classCallCheck(this, C);
    this.a = z // error
    ;
    this.c = this.z // error
    ;
    z = 1;
};
var D = function D(x) {
    "use strict";
    _classCallCheck(this, D);
    this.a = z // error
    ;
    this.c = this.z // error
    ;
    z = 1;
};
