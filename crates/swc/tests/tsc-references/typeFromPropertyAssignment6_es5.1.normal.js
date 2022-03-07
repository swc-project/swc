import * as swcHelpers from "@swc/helpers";
var Outer = function Outer() {
    "use strict";
    swcHelpers.classCallCheck(this, Outer);
};
// @Filename: a.js
Outer.Inner = /*#__PURE__*/ (function() {
    "use strict";
    function I() {
        swcHelpers.classCallCheck(this, I);
    }
    var _proto = I.prototype;
    _proto.messages = function messages() {
        return [];
    };
    return I;
})();
/** @type {!Outer.Inner} */ Outer.i;
// @Filename: b.js
var msgs = Outer.i.messages();
/** @param {Outer.Inner} inner */ function x(inner) {}
