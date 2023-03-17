//// [file.tsx]
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
_object_spread_props(_object_spread({}, {
    x: 32,
    y: 32
}), {
    x: "ok"
}), _object_spread({
    x: "ok"
}, {
    x: 32,
    y: 32
}), _object_spread({
    x: 32
}, {
    x: "foo"
});
