import _object_spread from "@swc/helpers/lib/_object_spread.js";
import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
// @target: es2015
let array;
for (let _ref of array){
    var { x  } = _ref, restOf = _object_without_properties(_ref, [
        "x"
    ]);
    [
        x,
        restOf
    ];
}
let xx;
let rrestOff;
for (var _ref1 of array){
    var __ref;
    __ref = _ref1, rrestOff = _object_without_properties(__ref, [
        "x"
    ]), ({ x: xx  } = __ref), __ref;
    [
        xx,
        rrestOff
    ];
}
for (const norest of array.map((a)=>_object_spread({}, a, {
        x: 'a string'
    }))){
    [
        norest.x,
        norest.y
    ];
// x is now a string. who knows why.
}
