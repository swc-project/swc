//// [protectedStaticClassPropertyAccessibleWithinSubclass.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    Base.staticMethod = function staticMethod() {
        Base.x; // OK, accessed within their declaring class
        Derived1.x; // OK, accessed within their declaring class
        Derived2.x; // OK, accessed within their declaring class
        Derived3.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
    };
    return Base;
}();
var Derived1 = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(Derived1, Base1);
    function Derived1() {
        _class_call_check(this, Derived1);
        return _call_super(this, Derived1, arguments);
    }
    Derived1.staticMethod1 = function staticMethod1() {
        Base.x; // OK, accessed within a class derived from their declaring class
        Derived1.x; // OK, accessed within a class derived from their declaring class
        Derived2.x; // OK, accessed within a class derived from their declaring class
        Derived3.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
    };
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(Derived2, Base1);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _call_super(this, Derived2, arguments);
    }
    Derived2.staticMethod2 = function staticMethod2() {
        Base.x; // OK, accessed within a class derived from their declaring class
        Derived1.x; // OK, accessed within a class derived from their declaring class
        Derived2.x; // OK, accessed within a class derived from their declaring class
        Derived3.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
    };
    return Derived2;
}(Base);
var Derived3 = /*#__PURE__*/ function(Derived11) {
    "use strict";
    _inherits(Derived3, Derived11);
    function Derived3() {
        _class_call_check(this, Derived3);
        return _call_super(this, Derived3, arguments);
    }
    Derived3.staticMethod3 = function staticMethod3() {
        Base.x; // OK, accessed within a class derived from their declaring class
        Derived1.x; // OK, accessed within a class derived from their declaring class
        Derived2.x; // OK, accessed within a class derived from their declaring class
        Derived3.x; // OK, accessed within their declaring class
    };
    return Derived3;
}(Derived1);
Base.x; // Error, neither within their declaring class nor classes derived from their declaring class
Derived1.x; // Error, neither within their declaring class nor classes derived from their declaring class
Derived2.x; // Error, neither within their declaring class nor classes derived from their declaring class
Derived3.x; // Error, neither within their declaring class nor classes derived from their declaring class
