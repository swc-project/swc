//// [derivedClassWithoutExplicitConstructor.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Derived = /*#__PURE__*/ function(Base) {
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _this = _call_super(this, Derived, arguments), _this.x = 1, _this.y = 'hello', _this;
    }
    return _inherits(Derived, Base), Derived;
}(function Base(x) {
    _class_call_check(this, Base), this.a = 1, this.a = x;
});
new Derived(), new Derived(1);
var D = /*#__PURE__*/ function(Base2) {
    function D() {
        var _this;
        return _class_call_check(this, D), _this = _call_super(this, D, arguments), _this.x = 2, _this.y = null, _this;
    }
    return _inherits(D, Base2), D;
}(function Base2(x) {
    _class_call_check(this, Base2), this.a = x;
});
new D(), new D(new Date());
