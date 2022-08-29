//// [protectedStaticNotAccessibleInClodule.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
!function(C1) {
    C1.f = C.foo, C1.b = C.bar;
}(C || (C = {}));
