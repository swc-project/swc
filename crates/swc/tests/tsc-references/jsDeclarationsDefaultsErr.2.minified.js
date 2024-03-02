//// [index1.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Cls = function Cls() {
    _class_call_check(this, Cls), this.x = 12;
};
Cls.y = "ok";
export default Cls;
//// [index2.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    _class_call_check(this, C);
};
export { C as default };
//// [index3.js]
var x = 12;
export { x as default };
