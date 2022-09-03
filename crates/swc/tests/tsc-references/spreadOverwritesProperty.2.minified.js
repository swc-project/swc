//// [spreadOverwritesProperty.ts]
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
var unused1 = _object_spread({
    b: 1
}, ab), unused2 = _object_spread({}, ab, ab), unused3 = _object_spread({
    b: 1
}, abq);
function g(obj) {
    return _object_spread({
        x: 1
    }, obj);
}
function h(obj) {
    return _object_spread({
        x: 1
    }, obj);
}
