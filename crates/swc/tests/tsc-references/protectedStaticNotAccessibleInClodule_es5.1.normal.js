import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
(function(C1) {
    var f = C1.f = C.foo;
    var b = C1.b = C.bar;
})(C || (C = {}));
