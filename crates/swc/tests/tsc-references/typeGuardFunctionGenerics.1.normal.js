//// [typeGuardFunctionGenerics.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
var C = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(C, A);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
}(A);
var a;
var test1 = funA(isB);
if (funB(retC, a)) {
    a.propC;
}
var test2 = funC(isB);
if (funD(isC, a)) {
    a.propC;
}
var test3 = funE(isB, 1);
