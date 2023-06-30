//// [objectRestForOf.ts]
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
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
for (var _ref of array){
    var _ref1;
    _ref1 = _ref, rrestOff = _object_without_properties(_ref1, [
        "x"
    ]), ({ x: xx } = _ref1), _ref1;
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
