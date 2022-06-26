import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @filename: exportConsts.ts
// @strict: true
export { x };
export { x as xx };
export default x;
var x = "x";
export { Y as Z };
var Y = function Y() {
    "use strict";
    _class_call_check(this, Y);
};
// @filename: exportVars.ts
// @strict: true
export { y };
export { y as yy };
export default y;
var y = "y";
