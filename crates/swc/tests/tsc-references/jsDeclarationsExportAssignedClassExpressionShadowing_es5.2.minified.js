function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var A = function() {
    "use strict";
    _classCallCheck(this, A), this.member = new Q();
}, Q = function Q() {
    "use strict";
    _classCallCheck(this, Q), this.x = 42;
};
module.exports = function Q() {
    "use strict";
    _classCallCheck(this, Q), this.x = new A();
}, module.exports.Another = Q;
