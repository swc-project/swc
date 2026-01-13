//// [classAbstractImportInstantiation.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(M) {
    var A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    M.A = A;
    new A;
})(M || (M = {}));
var myA = M.A;
new myA;
var M;
