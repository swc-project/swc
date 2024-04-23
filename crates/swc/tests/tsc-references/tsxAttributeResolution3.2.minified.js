//// [file.tsx]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
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
    x: 'foo'
});
