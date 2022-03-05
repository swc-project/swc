import * as swcHelpers from "@swc/helpers";
var A = function A() {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    this.member = new Q();
};
var Q = function Q() {
    "use strict";
    swcHelpers.classCallCheck(this, Q);
    this.x = 42;
};
module.exports = function Q() {
    "use strict";
    swcHelpers.classCallCheck(this, Q);
    this.x = new A();
};
module.exports.Another = Q;
