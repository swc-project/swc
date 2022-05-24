import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index.js
var A = function A() {
    "use strict";
    _class_call_check(this, A);
    this.member = new Q();
};
var Q = function Q() {
    "use strict";
    _class_call_check(this, Q);
    this.x = 42;
};
module.exports = function Q() {
    "use strict";
    _class_call_check(this, Q);
    this.x = new A();
};
module.exports.Another = Q;
