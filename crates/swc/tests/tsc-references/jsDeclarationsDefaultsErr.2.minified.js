//// [index1.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Cls = function Cls() {
    "use strict";
    _class_call_check(this, Cls), this.x = 12;
};
Cls.y = "ok";
export default Cls;
//// [index2.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
export { C as default };
//// [index3.js]
var x = 12;
export { x as default };
