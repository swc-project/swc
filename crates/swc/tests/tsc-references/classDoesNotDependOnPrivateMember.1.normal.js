//// [classDoesNotDependOnPrivateMember.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var M;
(function(M) {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    M.C = C;
})(M || (M = {}));
