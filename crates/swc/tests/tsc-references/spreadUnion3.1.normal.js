//// [spreadUnion3.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
function f(x) {
    return _object_spread({
        y: 123
    }, x) // y: string | number
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
