//// [file.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var props = {
    a: 1,
    b: 1
};
_object_spread({
    d: 1
}, props), _object_spread({
    a: 1
}, props), _object_spread({
    a: 1,
    b: 2
}, props), _object_spread_props(_object_spread({
    a: 1,
    d: 1
}, props), {
    d: 1
}), _object_spread_props(_object_spread({
    a: 1,
    d: 1
}, props), {
    a: 1,
    d: 1
});
