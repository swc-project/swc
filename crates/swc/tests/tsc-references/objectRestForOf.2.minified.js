//// [objectRestForOf.ts]
let array, xx;
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
for (let _ref of array){
    var _ref1, { x  } = _ref;
    _object_without_properties(_ref, [
        "x"
    ]);
}
for (var _ref2 of array)_object_without_properties(_ref1 = _ref2, [
    "x"
]), { x: xx  } = _ref1;
for (let norest of array.map((a)=>_object_spread_props(_object_spread({}, a), {
        x: 'a string'
    })))norest.x, norest.y;
