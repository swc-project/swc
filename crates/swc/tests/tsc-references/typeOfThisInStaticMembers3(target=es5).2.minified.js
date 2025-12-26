//// [typeOfThisInStaticMembers3.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
new WeakMap(), new WeakMap();
var __1 = new WeakMap(), __21 = new WeakMap(), __3 = new WeakMap(), D = /*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D;
}(function C() {
    _class_call_check(this, C);
});
__1.set(D, {
    writable: !0,
    value: D.c = 2
}), __21.set(D, {
    writable: !0,
    value: D.d = D.c + 1
}), __3.set(D, {
    writable: !0,
    value: D.e = super.a + D.c + 1
});
