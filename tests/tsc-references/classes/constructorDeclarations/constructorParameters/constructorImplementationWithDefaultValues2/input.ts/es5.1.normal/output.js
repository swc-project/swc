function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var C = function C(param) {
    "use strict";
    var x = param === void 0 ? 1 : param;
    _classCallCheck(this, C);
    this.x = x;
    var y = x;
};
var D = function D(param, param1) {
    "use strict";
    var x = param === void 0 ? 1 : param, y = param1 === void 0 ? x : param1;
    _classCallCheck(this, D);
    this.y = y;
    var z = x;
};
var E = function E(param) {
    "use strict";
    var x = param === void 0 ? new Date() : param;
    _classCallCheck(this, E);
    var y = x;
};
