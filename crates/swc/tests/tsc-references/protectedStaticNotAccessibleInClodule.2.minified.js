//// [protectedStaticNotAccessibleInClodule.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
!function(C1) {
    C1.f = C.foo, C1.b = C.bar;
}(C || (C = {}));
