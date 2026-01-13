//// [foo1.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(M1 || (M1 = {})).C1 = function C1() {
    _class_call_check(this, C1), this.m1 = new foo2.M1.C1(), this.m1.y = 10, this.m1.x = 20;
};
export var M1;
//// [foo2.ts]
var M1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(M1 = M11 || (M11 = {})).C1 = function C1() {
    _class_call_check(this, C1), this.m1 = new foo1.M1.C1(), this.m1.y = 10, this.m1.x = 20;
    var tmp = new M1.C1();
    tmp.y = 10, tmp.x = 20;
};
var M11;
export { M11 as M1 };
