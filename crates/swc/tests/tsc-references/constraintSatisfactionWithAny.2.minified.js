//// [constraintSatisfactionWithAny.ts]
// any is not a valid type argument unless there is no constraint, or the constraint is any
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
//function foo5<T extends String, U extends T>(x: T, y: U): T { return null; }
//foo5(a, a);
//foo5<any, any>(b, b);
var a, b, C = function C(x) {
    _class_call_check(this, C), this.x = x;
};
new C(a), new C(b);
var C2 = function C2(x) {
    _class_call_check(this, C2), this.x = x;
};
new C2(a), new C2(b);
//class C3<T extends T[]> {
//    constructor(public x: T) { }
//}
//var c5 = new C3(a);
//var c6 = new C3<any>(b);
var C4 = function C4(x) {
    _class_call_check(this, C4), this.x = x;
};
new C4(a), new C4(b);
