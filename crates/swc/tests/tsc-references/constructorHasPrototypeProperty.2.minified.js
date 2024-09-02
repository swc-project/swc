//// [constructorHasPrototypeProperty.ts]
var NonGeneric, Generic, C, D, C1, D1;
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
NonGeneric || (NonGeneric = {}), D = /*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D;
}(C = function C() {
    _class_call_check(this, C);
}), C.prototype.foo, D.prototype.bar, Generic || (Generic = {}), D1 = /*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D;
}(C1 = function C() {
    _class_call_check(this, C);
}), C1.prototype.foo, D1.prototype.baz;
