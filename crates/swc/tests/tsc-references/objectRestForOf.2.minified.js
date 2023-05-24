//// [objectRestForOf.ts]
let array, xx;
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
for (let _ref of array){
    let { x  } = _ref;
    _object_without_properties(_ref, [
        "x"
    ]);
}
for (var _ref of array){
    var _ref1;
    _object_without_properties(_ref1 = _ref, [
        "x"
    ]), { x: xx  } = _ref1;
}
for (let norest of array.map((a)=>_object_spread_props(_object_spread({}, a), {
        x: 'a string'
    })))norest.x, norest.y;
