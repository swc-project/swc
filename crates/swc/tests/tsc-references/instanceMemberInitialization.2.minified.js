//// [instanceMemberInitialization.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    _class_call_check(this, C), this.x = 1;
}, c = new C();
c.x = 3;
var c2 = new C();
c.x, c2.x;
