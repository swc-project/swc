//// [invalidVoidValues.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var x;
x = 1;
x = '';
x = true;
var E;
(function(E) {
    E[E["A"] = 0] = "A";
})(E || (E = {}));
x = E;
x = 0;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var a;
x = a;
var b;
x = b;
x = {
    f: function f() {}
};
var M;
(function(M) {
    M.x = 1;
})(M || (M = {}));
x = M;
function f(a) {
    x = a;
}
x = f;
