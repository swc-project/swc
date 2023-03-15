//// [spreadUnion3.ts]
import _extends from "@swc/helpers/src/_extends.mjs";
function f(x) {
    return _extends({
        y: 123
    }, x) // y: string | number
    ;
}
f(undefined);
function g(t) {
    var b = _extends({}, t);
    var c = b.a; // might not have 'a'
}
g();
g(undefined);
g(null);
var x = _extends({}, nullAndUndefinedUnion, nullAndUndefinedUnion);
var y = _extends({}, nullAndUndefinedUnion);
