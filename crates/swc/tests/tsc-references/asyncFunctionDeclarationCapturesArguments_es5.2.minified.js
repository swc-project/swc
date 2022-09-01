//// [asyncFunctionDeclarationCapturesArguments_es5.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.method = function() {}, C;
}();
