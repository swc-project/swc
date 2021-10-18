function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var C = function() {
    "use strict";
    _classCallCheck(this, C), this.x = 1, this.y = "hello";
};
new C(), new C(null);
var D = function() {
    "use strict";
    _classCallCheck(this, D), this.x = 2, this.y = null;
};
new D(), new D(null);
