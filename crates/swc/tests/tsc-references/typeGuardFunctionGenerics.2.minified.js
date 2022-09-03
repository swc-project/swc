//// [typeGuardFunctionGenerics.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var a, A = function A() {
    "use strict";
    _class_call_check(this, A);
}, B = function B() {
    "use strict";
    _class_call_check(this, B);
}, C = function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(A), test1 = funA(isB);
funB(retC, a) && a.propC;
var test2 = funC(isB);
funD(isC, a) && a.propC;
var test3 = funE(isB, 1);
