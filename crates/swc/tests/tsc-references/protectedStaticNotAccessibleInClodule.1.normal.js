//// [protectedStaticNotAccessibleInClodule.ts]
// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
(function(C1) {
    var f = C1.f = C.foo;
    var b = C1.b = C.bar;
})(C || (C = {}));
