//// [spreadUnion3.ts]
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
function f(x) {
    return _object_spread({
        y: 123
    }, x);
}
function g(t) {
    _object_spread({}, t).a;
}
f(void 0), g(), g(void 0), g(null);
var x = _object_spread({}, nullAndUndefinedUnion, nullAndUndefinedUnion), y = _object_spread({}, nullAndUndefinedUnion);
