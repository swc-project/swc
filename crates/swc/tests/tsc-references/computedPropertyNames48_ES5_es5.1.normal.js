import * as swcHelpers from "@swc/helpers";
var E;
(function(E) {
    E[E["x"] = 0] = "x";
})(E || (E = {}));
var a;
extractIndexer(swcHelpers.defineProperty({}, a, "")); // Should return string
extractIndexer(swcHelpers.defineProperty({}, E.x, "")); // Should return string
extractIndexer(swcHelpers.defineProperty({}, "" || 0, "")); // Should return any (widened form of undefined)
