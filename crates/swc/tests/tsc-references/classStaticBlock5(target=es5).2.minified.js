//// [classStaticBlock5.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _superprop_get_b = ()=>super.b, _superprop_get_a = ()=>super.a;
new WeakMap(), new WeakMap();
var __1 = new WeakMap(), __21 = new WeakMap(), __3 = new WeakMap(), C = /*#__PURE__*/ function(B) {
    function C() {
        return _class_call_check(this, C), _call_super(this, C, arguments);
    }
    return _inherits(C, B), C;
}(function B() {
    _class_call_check(this, B);
});
__1.set(C, {
    writable: !0,
    value: C.b = 3
}), __21.set(C, {
    writable: !0,
    value: C.c = super.a
}), __3.set(C, {
    writable: !0,
    value: void (C.b, _superprop_get_b(), _superprop_get_a())
});
