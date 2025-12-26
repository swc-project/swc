//// [typeOfThisInStaticMembers9.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = function C() {
    _class_call_check(this, C);
};
C.f = 1;
var D = /*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D;
}(C);
D.arrowFunctionBoundary = function() {
    return _get(_get_prototype_of(D), "f", D) + 1;
}, D.functionExprBoundary = function() {
    return _get(_get_prototype_of(D), "f", this) + 2;
}, D.classExprBoundary = function _class() {
    _class_call_check(this, _class), this.a = _get(_get_prototype_of(_class.prototype), "f", this) + 3;
}, D.functionAndClassDeclBoundary = void 0;
