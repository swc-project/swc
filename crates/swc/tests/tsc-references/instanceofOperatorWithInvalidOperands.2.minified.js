//// [instanceofOperatorWithInvalidOperands.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
var x, a1, a2, a3, a4, b1, b2, b3, b4, o1, o2, o3, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {}, C;
}(), ra1 = _instanceof(a1, x), ra2 = _instanceof(a2, x), ra3 = _instanceof(a3, x), ra4 = _instanceof(a4, x), ra5 = _instanceof(0, x), ra6 = _instanceof(!0, x), ra7 = _instanceof("", x), ra8 = _instanceof(null, x), ra9 = _instanceof(void 0, x), rb1 = _instanceof(x, b1), rb2 = _instanceof(x, b2), rb3 = _instanceof(x, b3), rb4 = _instanceof(x, b4), rb5 = _instanceof(x, 0), rb6 = _instanceof(x, !0), rb7 = _instanceof(x, ""), rb8 = _instanceof(x, o1), rb9 = _instanceof(x, o2), rb10 = _instanceof(x, o3), rc1 = _instanceof("", {});
