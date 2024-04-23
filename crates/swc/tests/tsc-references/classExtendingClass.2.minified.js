//// [classExtendingClass.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var d, d2, D = function(C) {
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(function() {
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.thing = function() {}, C.other = function() {}, C;
}());
d.foo, d.bar, d.thing(), D.other();
var D2 = function(C2) {
    _inherits(D2, C2);
    var _super = _create_super(D2);
    function D2() {
        return _class_call_check(this, D2), _super.apply(this, arguments);
    }
    return D2;
}(function() {
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.prototype.thing = function(x) {}, C2.other = function(x) {}, C2;
}());
d2.foo, d2.bar, d2.thing(''), D2.other(1);
