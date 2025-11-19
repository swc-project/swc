//// [spreadNonObject1.ts]
// https://github.com/microsoft/TypeScript/issues/45493
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
var b = {
    c: [
        "4"
    ].map(function(s) {
        var a = _object_spread_props(_object_spread({}, s), {
            y: 6
        });
    })
};
