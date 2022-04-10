import * as swcHelpers from "@swc/helpers";
var A = function() {
    swcHelpers.classCallCheck(this, A), this.member = new Q();
}, Q = function Q() {
    swcHelpers.classCallCheck(this, Q), this.x = 42;
};
module.exports = function Q() {
    swcHelpers.classCallCheck(this, Q), this.x = new A();
}, module.exports.Another = Q;
