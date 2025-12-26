//// [classStaticBlock5.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _superprop_get_b = ()=>super.b, _superprop_get_a = ()=>super.a;
var __ = new WeakMap(), __2 = new WeakMap(), __1 = new WeakMap(), __21 = new WeakMap(), __3 = new WeakMap();
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    return C;
}(B);
__1.set(C, {
    writable: true,
    value: C.b = 3
});
__21.set(C, {
    writable: true,
    value: C.c = super.a
});
__3.set(C, {
    writable: true,
    value: function() {
        C.b;
        _superprop_get_b();
        _superprop_get_a();
    }()
});
