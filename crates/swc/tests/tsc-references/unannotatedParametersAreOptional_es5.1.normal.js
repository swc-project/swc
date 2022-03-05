import * as swcHelpers from "@swc/helpers";
// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: test.js
function f(x) {}
f(); // Always been ok
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
        this.p = function(x) {};
    }
    swcHelpers.createClass(C, [
        {
            key: "m",
            value: function m(x) {}
        }
    ], [
        {
            key: "m",
            value: function m(x) {}
        }
    ]);
    return C;
}();
C.m(); // Always been ok
new C().m(); // Regression #39261
new C().p(); // Regression #39261
var obj = {
    m: function m(x) {},
    p: function(x) {}
};
obj.m(); // Always been ok
obj.p(); // Always been ok
