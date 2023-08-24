//// [classWithBaseClassButNoConstructor.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var C = function(Base) {
    _inherits(C, Base);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C;
}(function Base(x) {
    _class_call_check(this, Base);
});
new C(), new C(1);
var D = function(Base2) {
    _inherits(D, Base2);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(function Base2(x) {
    _class_call_check(this, Base2);
});
new D(), new D(1), new D(), new D(1), new D(), new D(1);
 // ok
