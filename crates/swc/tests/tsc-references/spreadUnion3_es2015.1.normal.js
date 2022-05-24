import _object_spread from "@swc/helpers/lib/_object_spread.js";
// @strictNullChecks: true
function f(x1) {
    return _object_spread({
        y: 123
    }, x1) // y: string | number
    ;
}
f(undefined);
function g(t) {
    let b = _object_spread({}, t);
    let c = b.a; // might not have 'a'
}
g();
g(undefined);
g(null);
var x = _object_spread({}, nullAndUndefinedUnion, nullAndUndefinedUnion);
var y = _object_spread({}, nullAndUndefinedUnion);
