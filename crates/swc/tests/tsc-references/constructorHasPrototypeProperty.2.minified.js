//// [constructorHasPrototypeProperty.ts]
var C, D, C1, D1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
D = function(C) {
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(C = function C() {
    _class_call_check(this, C);
}), C.prototype.foo, D.prototype.bar, D1 = function(C) {
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(C1 = function C() {
    _class_call_check(this, C);
}), C1.prototype.foo, D1.prototype.baz;
