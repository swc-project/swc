//// [spreadOverwritesProperty.ts]
// without strict null checks, none of these should be an error
import _extends from "@swc/helpers/src/_extends.mjs";
var unused1 = _extends({
    b: 1
}, ab);
var unused2 = _extends({}, ab, ab);
var unused3 = _extends({
    b: 1
}, abq);
function g(obj) {
    return _extends({
        x: 1
    }, obj);
}
function h(obj) {
    return _extends({
        x: 1
    }, obj);
}
