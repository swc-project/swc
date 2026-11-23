//// [objectRestForOf.ts]
var _ref;
let xx;
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
for (let _ref of void 0){
    let { x } = _ref;
    _object_without_properties(_ref, [
        "x"
    ]);
}
for (_ref of void 0)({ x: xx } = _ref), _object_without_properties(_ref, [
    "x"
]);
for (let norest of (void 0).map((a)=>_object_spread_props(_object_spread({}, a), {
        x: 'a string'
    })))norest.x, norest.y;
