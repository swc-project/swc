import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var MyClass = function() {
    "use strict";
    _class_call_check(this, MyClass), this.p = 123, this.pp = 123, this.ppp = 123;
};
MyClass.sp = 123, MyClass.spp = 123, MyClass.sppp = 123;
var MyGenericClass = function() {
    "use strict";
    _class_call_check(this, MyGenericClass);
};
MyClass.prototype.extension1 = function(p) {
    this.p = p, this.pp = p, this.ppp = p, MyClass.sp = p, MyClass.spp = p, MyClass.sppp = p;
}, MyClass.prototype.extension2 = function(p) {
    this.p = p, this.pp = p, this.ppp = p, MyClass.sp = p, MyClass.spp = p, MyClass.sppp = p;
}, MyClass.prototype.extension3 = function(p) {
    this.p = p, this.pp = p, this.ppp = p, MyClass.sp = p, MyClass.spp = p, MyClass.sppp = p;
};
