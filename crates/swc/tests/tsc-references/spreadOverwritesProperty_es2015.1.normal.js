import _object_spread from "@swc/helpers/src/_object_spread.mjs";
var unused1 = _object_spread({
    b: 1
}, ab);
var unused2 = _object_spread({}, ab, ab);
var unused3 = _object_spread({
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
