import * as swcHelpers from "@swc/helpers";
// @target: es2015
let array;
for (let _ref of array){
    var { x  } = _ref, restOf = swcHelpers.objectWithoutProperties(_ref, [
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
    __ref = _ref1, rrestOff = swcHelpers.objectWithoutProperties(__ref, [
        "x"
    ]), ({ x: xx  } = __ref), __ref;
    [
        xx,
        rrestOff
    ];
}
for (const norest of array.map((a)=>swcHelpers.objectSpread({}, a, {
        x: 'a string'
    }))){
    [
        norest.x,
        norest.y
    ];
// x is now a string. who knows why.
}
