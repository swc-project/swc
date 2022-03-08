import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index.js
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
