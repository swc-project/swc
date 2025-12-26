//// [thisTypeAccessibility.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var MyClass = function MyClass() {
    _class_call_check(this, MyClass), this.p = 123, this.pp = 123, this.ppp = 123;
};
MyClass.sp = 123, MyClass.spp = 123, MyClass.sppp = 123, MyClass.prototype.extension1 = function(p) {
    this.p = p, this.pp = p, this.ppp = p, MyClass.sp = p, MyClass.spp = p, MyClass.sppp = p;
}, MyClass.prototype.extension2 = function(p) {
    this.p = p, this.pp = p, this.ppp = p, MyClass.sp = p, MyClass.spp = p, MyClass.sppp = p;
}, MyClass.prototype.extension3 = function(p) {
    this.p = p, this.pp = p, this.ppp = p, MyClass.sp = p, MyClass.spp = p, MyClass.sppp = p;
};
