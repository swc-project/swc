//// [spreadNonObject1.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
[
    "4"
].map(function(s) {
    _object_spread_props(_object_spread({}, s), {
        y: 6
    });
});
