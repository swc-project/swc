//// [exportConsts.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export default x;
var x = 'x';
var Y = function Y() {
    _class_call_check(this, Y);
};
export { x, x as xx, Y as Z };
//// [exportVars.ts]
export default y;
var y = 'y';
export { y, y as yy };
