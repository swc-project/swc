import * as swcHelpers from "@swc/helpers";
let array;
for (let _ref of array){
    var __ref, { x  } = _ref;
    swcHelpers.objectWithoutProperties(_ref, [
        "x"
    ]);
}
let xx;
for (var _ref1 of array)__ref = _ref1, swcHelpers.objectWithoutProperties(__ref, [
    "x"
]), { x: xx  } = __ref;
for (let norest of array.map((a)=>swcHelpers.objectSpread({}, a, {
        x: 'a string'
    })))norest.x, norest.y;
