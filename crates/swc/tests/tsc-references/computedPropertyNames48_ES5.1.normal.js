//// [computedPropertyNames48_ES5.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
var E;
(function(E) {
    E[E["x"] = 0] = "x";
})(E || (E = {}));
var a;
extractIndexer(_define_property({}, a, "")); // Should return string
extractIndexer(_define_property({}, E.x, "")); // Should return string
extractIndexer(_define_property({}, "" || 0, "")); // Should return any (widened form of undefined)
