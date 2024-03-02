//// [a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    _class_call_check(this, C), this.p = 1;
};
C.prototype = {
    q: 2
};
var c = new C();
c.p, c.q;
