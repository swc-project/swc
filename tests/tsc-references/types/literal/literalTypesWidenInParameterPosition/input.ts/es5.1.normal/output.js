function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var D = function D(param) {
    "use strict";
    var widen = param === void 0 ? 2 : param;
    _classCallCheck(this, D);
    this.widen = widen;
    this.noWiden = 1;
    this.noWiden = 5; // error
    this.widen = 6; // ok
};
new D(7); // ok
