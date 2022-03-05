import * as swcHelpers from "@swc/helpers";
// @strictNullChecks: true
function f(x1) {
    return swcHelpers.objectSpread({
        y: 123
    }, x1) // y: string | number
    ;
}
f(undefined);
function g(t) {
    var b = swcHelpers.objectSpread({}, t);
    var c = b.a; // might not have 'a'
}
g();
g(undefined);
g(null);
var x = swcHelpers.objectSpread({}, nullAndUndefinedUnion, nullAndUndefinedUnion);
var y = swcHelpers.objectSpread({}, nullAndUndefinedUnion);
