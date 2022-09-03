//// [classAbstractImportInstantiation.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(M) {
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M.A = A, new A;
}(M || (M = {}));
var M, myA = M.A;
new myA;
