import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.method = function method() {
        var b1;
        var d11;
        var d21;
        var d31;
        var d41;
        b1.x; // OK, accessed within their declaring class
        d11.x; // OK, accessed within their declaring class
        d21.x; // OK, accessed within their declaring class
        d31.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
        d41.x; // OK, accessed within their declaring class
    };
    return Base;
}();
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _create_super(Derived1);
    function Derived1() {
        _class_call_check(this, Derived1);
        return _super.apply(this, arguments);
    }
    var _proto = Derived1.prototype;
    _proto.method1 = function method1() {
        var b2;
        var d12;
        var d22;
        var d32;
        var d42;
        b2.x; // Error, isn't accessed through an instance of the enclosing class
        d12.x; // OK, accessed within a class derived from their declaring class, and through an instance of the enclosing class
        d22.x; // Error, isn't accessed through an instance of the enclosing class
        d32.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
        d42.x; // Error, isn't accessed through an instance of the enclosing class
    };
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _super.apply(this, arguments);
    }
    var _proto = Derived2.prototype;
    _proto.method2 = function method2() {
        var b3;
        var d13;
        var d23;
        var d33;
        var d43;
        b3.x; // Error, isn't accessed through an instance of the enclosing class
        d13.x; // Error, isn't accessed through an instance of the enclosing class
        d23.x; // OK, accessed within a class derived from their declaring class, and through an instance of the enclosing class
        d33.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
        d43.x; // OK, accessed within a class derived from their declaring class, and through an instance of the enclosing class or one of its subclasses
    };
    return Derived2;
}(Base);
var Derived3 = /*#__PURE__*/ function(Derived1) {
    "use strict";
    _inherits(Derived3, Derived1);
    var _super = _create_super(Derived3);
    function Derived3() {
        _class_call_check(this, Derived3);
        return _super.apply(this, arguments);
    }
    var _proto = Derived3.prototype;
    _proto.method3 = function method3() {
        var b4;
        var d14;
        var d24;
        var d34;
        var d44;
        b4.x; // Error, isn't accessed through an instance of the enclosing class
        d14.x; // Error, isn't accessed through an instance of the enclosing class
        d24.x; // Error, isn't accessed through an instance of the enclosing class
        d34.x; // OK, accessed within their declaring class
        d44.x; // Error, isn't accessed through an instance of the enclosing class
    };
    return Derived3;
}(Derived1);
var Derived4 = /*#__PURE__*/ function(Derived2) {
    "use strict";
    _inherits(Derived4, Derived2);
    var _super = _create_super(Derived4);
    function Derived4() {
        _class_call_check(this, Derived4);
        return _super.apply(this, arguments);
    }
    var _proto = Derived4.prototype;
    _proto.method4 = function method4() {
        var b5;
        var d15;
        var d25;
        var d35;
        var d45;
        b5.x; // Error, isn't accessed through an instance of the enclosing class
        d15.x; // Error, isn't accessed through an instance of the enclosing class
        d25.x; // Error, isn't accessed through an instance of the enclosing class
        d35.x; // Error, redefined in a subclass, can only be accessed in the declaring class or one of its subclasses
        d45.x; // OK, accessed within a class derived from their declaring class, and through an instance of the enclosing class
    };
    return Derived4;
}(Derived2);
var b;
var d1;
var d2;
var d3;
var d4;
b.x; // Error, neither within their declaring class nor classes derived from their declaring class
d1.x; // Error, neither within their declaring class nor classes derived from their declaring class
d2.x; // Error, neither within their declaring class nor classes derived from their declaring class
d3.x; // Error, neither within their declaring class nor classes derived from their declaring class
d4.x; // Error, neither within their declaring class nor classes derived from their declaring class
