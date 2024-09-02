//// [protectedStaticClassPropertyAccessibleWithinSubclass2.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    Base.staticMethod = function staticMethod() {
        this.x; // OK, accessed within their declaring class
    };
    return Base;
}();
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    function Derived1() {
        _class_call_check(this, Derived1);
        return _call_super(this, Derived1, arguments);
    }
    Derived1.staticMethod1 = function staticMethod1() {
        this.x; // OK, accessed within a class derived from their declaring class
        _get(_get_prototype_of(Derived1), "x", this); // Error, x is not public
    };
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived1) {
    "use strict";
    _inherits(Derived2, Derived1);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _call_super(this, Derived2, arguments);
    }
    Derived2.staticMethod3 = function staticMethod3() {
        this.x; // OK, accessed within a class derived from their declaring class
        _get(_get_prototype_of(Derived2), "x", this); // Error, x is not public
    };
    return Derived2;
}(Derived1);
