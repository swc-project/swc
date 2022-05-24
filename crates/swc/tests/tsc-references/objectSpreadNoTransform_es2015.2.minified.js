var b, _o;
import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
let o = _object_spread({
    x: 1
}, {
    a: 'yes',
    b: 'no'
});
_object_without_properties(_o = o, [
    "b"
]), { b  } = _o;
