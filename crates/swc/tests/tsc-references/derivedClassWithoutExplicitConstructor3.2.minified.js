//// [derivedClassWithoutExplicitConstructor3.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base(x) {
    _class_call_check(this, Base), this.a = 1, this.a = x;
}, Derived = /*#__PURE__*/ function(Base) {
    function Derived(y, z) {
        var _this;
        return _class_call_check(this, Derived), (_this = _call_super(this, Derived, [
            2
        ])).b = '', _this.b = y, _this;
    }
    return _inherits(Derived, Base), Derived;
}(Base), Derived2 = /*#__PURE__*/ function(Derived) {
    function Derived2() {
        var _this;
        return _class_call_check(this, Derived2), _this = _call_super(this, Derived2, arguments), _this.x = 1, _this.y = 'hello', _this;
    }
    return _inherits(Derived2, Derived), Derived2;
}(Derived);
new Derived(), new Derived2(1), new Derived('', '');
var D2 = /*#__PURE__*/ function(D) {
    function D2() {
        var _this;
        return _class_call_check(this, D2), _this = _call_super(this, D2, arguments), _this.x = 2, _this.y = null, _this;
    }
    return _inherits(D2, D), D2;
}(/*#__PURE__*/ function(Base) {
    function D(y, z) {
        var _this;
        return _class_call_check(this, D), (_this = _call_super(this, D, [
            2
        ])).b = null, _this.b = y, _this;
    }
    return _inherits(D, Base), D;
}(Base));
new D2(), new D2(new Date()), new D2(new Date(), new Date());
