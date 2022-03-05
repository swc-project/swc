import * as swcHelpers from "@swc/helpers";
export var E1;
(function(E1) {
    E1[E1["A"] = 0] = "A";
    E1[E1["B"] = 1] = "B";
    E1[E1["C"] = 2] = "C";
})(E1 || (E1 = {}));
var C1 = function C1() {
    "use strict";
    swcHelpers.classCallCheck(this, C1);
};
// Invalid, as there is already an exported member.
module.exports = C1;
