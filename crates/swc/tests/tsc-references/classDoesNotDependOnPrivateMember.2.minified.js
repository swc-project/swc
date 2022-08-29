//// [classDoesNotDependOnPrivateMember.ts]
var M;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(M) {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    M.C = C;
}(M || (M = {}));
