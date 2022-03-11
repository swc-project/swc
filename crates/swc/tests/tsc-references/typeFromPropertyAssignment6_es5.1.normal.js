import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @target: es6
// @Filename: def.js
var Outer = function Outer() {
    "use strict";
    swcHelpers.classCallCheck(this, Outer);
};
// @Filename: a.js
Outer.Inner = /*#__PURE__*/ function() {
    "use strict";
    function I() {
        swcHelpers.classCallCheck(this, I);
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
