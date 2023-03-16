//// [file.tsx]
var p1, p2, p3;
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
_object_spread({
    x: p3
}, p1), _object_spread_props(_object_spread({}, p1), {
    x: p3
}), _object_spread_props(_object_spread({
    x: p2
}, p1), {
    y: p3
});
