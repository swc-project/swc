import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function(foo) {
    "use strict";
    _class_call_check(this, C), this.foo = foo;
};
C.create = function() {
    return new C("yep");
};
