import _define_property from "@swc/helpers/lib/_define_property.js";
var // @target: es5
E1;
(function(E1) {
    E1[E1["x"] = 0] = "x";
})(E1 || (E1 = {}));
var E2;
(function(E2) {
    E2[E2["x"] = 0] = "x";
})(E2 || (E2 = {}));
var o = _define_property({}, E1.x || E2.x, 0);
