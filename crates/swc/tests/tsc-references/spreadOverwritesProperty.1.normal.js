//// [spreadOverwritesProperty.ts]
// without strict null checks, none of these should be an error
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
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
