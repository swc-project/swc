//// [invalidAssignmentsToVoid.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var x;
x = 1;
x = true;
x = '';
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
(function(M) {
    M.x = 1;
})(M || (M = {}));
x = M;
function f(a) {
    x = a;
}
x = f;
var M;
