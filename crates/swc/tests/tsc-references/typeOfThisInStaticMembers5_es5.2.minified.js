import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function(foo) {
    "use strict";
    _class_call_check(this, C), this.foo = foo;
};
C.create = function() {
    return new C("yep");
};
