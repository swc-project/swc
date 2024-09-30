//// [undefinedAssignableToEveryType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var ac;
var ai;
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    return E;
}(E || {});
var ae;
var b = undefined;
var c = undefined;
var d = undefined;
var e = undefined;
var f = undefined;
var g = undefined;
var h = undefined;
var i = undefined;
var j = undefined;
var k = undefined;
var l = undefined;
ac = undefined;
ai = undefined;
ae = undefined;
var m = undefined;
var n = undefined;
var o = undefined;
var p = undefined;
var q = undefined;
function foo(x, y, z) {
    x = undefined;
    y = undefined;
    z = undefined;
} //function foo<T, U extends T, V extends Date>(x: T, y: U, z: V) {
 //    x = undefined;
 //    y = undefined;
 //    z = undefined;
 //}
