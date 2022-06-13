import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @target: es6
// @Filename: def.js
var Outer = function Outer() {
    "use strict";
    _class_call_check(this, Outer);
};
// @Filename: a.js
Outer.Inner = /*#__PURE__*/ function() {
    "use strict";
    function I() {
        _class_call_check(this, I);
    }
    var _proto = I.prototype;
    _proto.messages = function messages() {
        return [];
    };
    return I;
}();
/** @type {!Outer.Inner} */ Outer.i;
// @Filename: b.js
var msgs = Outer.i.messages();
/** @param {Outer.Inner} inner */ function x(inner) {}
