import _define_property from "@swc/helpers/src/_define_property.mjs";
var E;
(function(E) {
    E[E["x"] = 0] = "x";
})(E || (E = {}));
var a;
extractIndexer(_define_property({}, a, "")); // Should return string
extractIndexer(_define_property({}, E.x, "")); // Should return string
extractIndexer(_define_property({}, "" || 0, "")); // Should return any (widened form of undefined)
