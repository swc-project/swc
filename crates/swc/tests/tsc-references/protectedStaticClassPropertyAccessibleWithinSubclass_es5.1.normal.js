import * as swcHelpers from "@swc/helpers";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
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
    swcHelpers.inherits(Derived1, Base1);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        swcHelpers.classCallCheck(this, Derived1);
        return _super.apply(this, arguments);
    }
    Derived1.staticMethod1 = function staticMethod1() {
        Base.x; // OK, accessed within a class derived from their declaring class
        Derived1.x; // OK, accessed within a class derived from their declaring class
        Derived2.x; // OK, accessed within a class derived from their declaring class
        Derived3.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
    };
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    swcHelpers.inherits(Derived2, Base2);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        swcHelpers.classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
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
    swcHelpers.inherits(Derived3, Derived11);
    var _super = swcHelpers.createSuper(Derived3);
    function Derived3() {
        swcHelpers.classCallCheck(this, Derived3);
        return _super.apply(this, arguments);
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
