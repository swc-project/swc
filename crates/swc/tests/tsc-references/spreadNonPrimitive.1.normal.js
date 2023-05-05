//// [spreadNonPrimitive.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var x = _object_spread_props(_object_spread({
    a: 1
}, o), {
    b: 2
});
