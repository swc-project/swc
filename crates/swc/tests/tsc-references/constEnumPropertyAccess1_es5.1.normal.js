import * as swcHelpers from "@swc/helpers";
var // @declaration: true
// @target: es6
// constant enum declarations are completely erased in the emitted JavaScript code.
// it is an error to reference a constant enum object in any other context
// than a property access that selects one of the enum's members
G;
(function(G) {
    G[G["A"] = 1] = "A";
    G[G["B"] = 2] = "B";
    G[G["C"] = 3] = "C";
    G[G["D"] = 2] = "D";
})(G || (G = {}));
var o = {
    1: true
};
var a = 1;
var a1 = 1;
var g = o[1];
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: 1,
            value: function value() {}
        },
        {
            key: 2,
            get: function get() {
                return true;
            }
        },
        {
            key: 2,
            set: function set(x) {}
        }
    ]);
    return C;
}();
