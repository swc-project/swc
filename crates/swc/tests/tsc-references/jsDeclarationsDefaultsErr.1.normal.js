//// [index1.js]
// merge type alias and alias (should error, see #32367)
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Cls = function Cls() {
    "use strict";
    _class_call_check(this, Cls);
    this.x = 12;
};
Cls.y = "ok";
export default Cls; /**
 * @typedef {string | number} default
 */ 
//// [index2.js]
// merge type alias and class (error message improvement needed, see #32368)
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
export { C as default };
 /**
 * @typedef {string | number} default
 */ //// [index3.js]
// merge type alias and variable (behavior is borked, see #32366)
var x = 12;
export { x as default }; /**
 * @typedef {string | number} default
 */ 
