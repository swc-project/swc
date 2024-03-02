//// [objectSpreadStrictNull.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
_object_spread_props(_object_spread({}, {
    title: "The Matrix",
    yearReleased: 1999
}), {
    title: void 0
});
