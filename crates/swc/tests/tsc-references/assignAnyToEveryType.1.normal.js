//// [assignAnyToEveryType.ts]
// all of these are valid
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var x;
var a = x;
var b = x;
var c = x;
var d = x;
var e = null;
e = x;
var f = undefined;
f = x;
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    return E;
}(E || {});
var g = x;
var g2 = 0;
g2 = x;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var h = x;
var i = x;
var j = x;
var j2 = x;
(function(M) {
    M.foo = 1;
})(M || (M = {}));
M = x;
function k(a) {
    a = x;
}
var M;
