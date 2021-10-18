function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    super(); // error
};
var D = function D(x) {
    "use strict";
    _classCallCheck(this, D);
    super(); // error
    this.x = x;
};
