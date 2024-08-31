//// [protectedStaticClassPropertyAccessibleWithinSubclass.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = /*#__PURE__*/ function() {
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.staticMethod = function() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }, Base;
}(), Derived1 = /*#__PURE__*/ function(Base1) {
    function Derived1() {
        return _class_call_check(this, Derived1), _call_super(this, Derived1, arguments);
    }
    return _inherits(Derived1, Base1), Derived1.staticMethod1 = function() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }, Derived1;
}(Base), Derived2 = /*#__PURE__*/ function(Base1) {
    function Derived2() {
        return _class_call_check(this, Derived2), _call_super(this, Derived2, arguments);
    }
    return _inherits(Derived2, Base1), Derived2.staticMethod2 = function() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }, Derived2;
}(Base), Derived3 = /*#__PURE__*/ function(Derived11) {
    function Derived3() {
        return _class_call_check(this, Derived3), _call_super(this, Derived3, arguments);
    }
    return _inherits(Derived3, Derived11), Derived3.staticMethod3 = function() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }, Derived3;
}(Derived1);
Base.x, Derived1.x, Derived2.x, Derived3.x;
