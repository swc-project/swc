//// [classWithBaseClassButNoConstructor.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var C = /*#__PURE__*/ function(Base) {
    function C() {
        return _class_call_check(this, C), _call_super(this, C, arguments);
    }
    return _inherits(C, Base), C;
}(function Base(x) {
    _class_call_check(this, Base);
});
new C(), new C(1);
var D = /*#__PURE__*/ function(Base2) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, Base2), D;
}(function Base2(x) {
    _class_call_check(this, Base2);
});
new D(), new D(1), new D(), new D(1), new D(), new D(1);
