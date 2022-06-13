import _object_spread from "@swc/helpers/src/_object_spread.mjs";
// @strictNullChecks: true
function f(x1) {
    return _object_spread({
        y: 123
    }, x1) // y: string | number
    ;
}
f(undefined);
function g(t) {
    var b = _object_spread({}, t);
    var c = b.a; // might not have 'a'
}
g();
g(undefined);
g(null);
var x = _object_spread({}, nullAndUndefinedUnion, nullAndUndefinedUnion);
var y = _object_spread({}, nullAndUndefinedUnion);
