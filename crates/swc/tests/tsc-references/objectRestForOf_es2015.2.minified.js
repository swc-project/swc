import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
let array;
for (let _ref of array){
    var __ref, { x  } = _ref;
    _object_without_properties(_ref, [
        "x"
    ]);
}
let xx;
for (var _ref1 of array)_object_without_properties(__ref = _ref1, [
    "x"
]), { x: xx  } = __ref;
for (let norest of array.map((a)=>_object_spread_props(_object_spread({}, a), {
        x: 'a string'
    })))norest.x, norest.y;
