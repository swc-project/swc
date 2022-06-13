import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var x;
x = 1;
x = true;
x = "";
x = {};
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c;
x = C;
x = c;
var i;
x = i;
var M;
(function(M1) {
    var x = M1.x = 1;
})(M || (M = {}));
x = M;
function f(a) {
    x = a;
}
x = f;
