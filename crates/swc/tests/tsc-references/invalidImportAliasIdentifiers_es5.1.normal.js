import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// none of these should work, since non are actually modules
var V = 12;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var E;
(function(E) {
    E[E["Red"] = 0] = "Red";
    E[E["Blue"] = 1] = "Blue";
})(E || (E = {}));
export { };
