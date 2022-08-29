//// [ModuleWithExportedAndNonExportedClasses.ts]
var A;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    var _$A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    A.A = _$A;
    var AG = function AG() {
        "use strict";
        _class_call_check(this, AG);
    };
    A.AG = AG;
}(A || (A = {})), new A.A(), new A.AG(), new A.A2(), new A.A2();
