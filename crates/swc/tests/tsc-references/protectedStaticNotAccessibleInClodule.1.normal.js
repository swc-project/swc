//// [protectedStaticNotAccessibleInClodule.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
// Any attempt to access a private property member outside the class body that contains its declaration results in a compile-time error.
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
(function(C) {
    C.f = C.foo; // OK
    C.b = C.bar; // error
})(C || (C = {}));
