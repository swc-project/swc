//// [classWithoutExplicitConstructor.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    _class_call_check(this, C), this.x = 1, this.y = 'hello';
};
new C(), new C(null);
var D = function D() {
    _class_call_check(this, D), this.x = 2, this.y = null;
};
new D(), new D(null);
