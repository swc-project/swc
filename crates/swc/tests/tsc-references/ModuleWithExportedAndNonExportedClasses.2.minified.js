//// [ModuleWithExportedAndNonExportedClasses.ts]
var A;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(A) {
    A.A = function A() {
        "use strict";
        _class_call_check(this, A);
    }, A.AG = function AG() {
        "use strict";
        _class_call_check(this, AG);
    };
}(A || (A = {})), new A.A(), new A.AG(), new A.A2(), new A.A2();
