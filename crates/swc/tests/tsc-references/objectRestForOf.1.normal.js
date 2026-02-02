//// [objectRestForOf.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
var _ref;
let array;
for (let _ref of array){
    let { x } = _ref, restOf = _object_without_properties(_ref, [
        "x"
    ]);
    [
        x,
        restOf
    ];
}
let xx;
let rrestOff;
for (_ref of array){
    ({ x: xx } = _ref), rrestOff = _object_without_properties(_ref, [
        "x"
    ]), _ref;
    [
        xx,
        rrestOff
    ];
}
for (const norest of array.map((a)=>_object_spread_props(_object_spread({}, a), {
        x: 'a string'
    }))){
    [
        norest.x,
        norest.y
    ];
// x is now a string. who knows why.
}
