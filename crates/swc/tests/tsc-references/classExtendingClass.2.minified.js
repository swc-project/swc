//// [classExtendingClass.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var d, d2, D = /*#__PURE__*/ function(C) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, C), D;
}(/*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.thing = function() {}, C.other = function() {}, C;
}());
d.foo, d.bar, d.thing(), D.other();
var D2 = /*#__PURE__*/ function(C2) {
    function D2() {
        return _class_call_check(this, D2), _call_super(this, D2, arguments);
    }
    return _inherits(D2, C2), D2;
}(/*#__PURE__*/ function() {
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.prototype.thing = function(x) {}, C2.other = function(x) {}, C2;
}());
d2.foo, d2.bar, d2.thing(''), D2.other(1);
