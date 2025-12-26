//// [typeOfThisInStaticMembers9.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _superprop_get_f = ()=>super.f;
new WeakMap();
var __1 = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap(), D = /*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D;
}(function C() {
    _class_call_check(this, C);
});
__1.set(D, {
    writable: !0,
    value: D.arrowFunctionBoundary = function() {
        return _superprop_get_f() + 1;
    }
}), __2.set(D, {
    writable: !0,
    value: D.functionExprBoundary = function() {
        return super.f + 2;
    }
}), __3.set(D, {
    writable: !0,
    value: D.classExprBoundary = function _class() {
        _class_call_check(this, _class), this.a = _get(_get_prototype_of(_class.prototype), "f", this) + 3;
    }
}), __4.set(D, {
    writable: !0,
    value: D.functionAndClassDeclBoundary = void 0
});
