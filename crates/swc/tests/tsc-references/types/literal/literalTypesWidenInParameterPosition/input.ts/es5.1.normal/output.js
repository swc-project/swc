function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var D = function D() {
    "use strict";
    var widen = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 2;
    _classCallCheck(this, D);
    this.widen = widen;
    this.noWiden = 1;
    this.noWiden = 5; // error
    this.widen = 6; // ok
};
new D(7); // ok
