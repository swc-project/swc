import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: a.js
var Outer = /*#__PURE__*/ function() {
    "use strict";
    function O() {
        _class_call_check(this, O);
    }
    var _proto = O.prototype;
    _proto.m = function m(x, y) {};
    return O;
}();
Outer.Inner = /*#__PURE__*/ function() {
    "use strict";
    function I() {
        _class_call_check(this, I);
    }
    var _proto = I.prototype;
    _proto.n = function n(a, b) {};
    return I;
}();
/** @type {Outer} */ var si;
si.m;
/** @type {Outer.Inner} */ var oi;
oi.n;
