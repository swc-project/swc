import * as swcHelpers from "@swc/helpers";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    var _proto1 = Base.prototype;
    _proto1.method = function method() {
        var A = /*#__PURE__*/ function() {
            function A() {
                swcHelpers.classCallCheck(this, A);
            }
            var _proto = A.prototype;
            _proto.methoda = function methoda() {
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
            return A;
        }();
    };
    return Base;
}();
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived1, Base);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        swcHelpers.classCallCheck(this, Derived1);
        return _super.apply(this, arguments);
    }
    var _proto2 = Derived1.prototype;
    _proto2.method1 = function method1() {
        var B = /*#__PURE__*/ function() {
            function B() {
                swcHelpers.classCallCheck(this, B);
            }
            var _proto = B.prototype;
            _proto.method1b = function method1b() {
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
            return B;
        }();
    };
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived2, Base);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        swcHelpers.classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    var _proto3 = Derived2.prototype;
    _proto3.method2 = function method2() {
        var C = /*#__PURE__*/ function() {
            function C() {
                swcHelpers.classCallCheck(this, C);
            }
            var _proto = C.prototype;
            _proto.method2c = function method2c() {
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
            return C;
        }();
    };
    return Derived2;
}(Base);
var Derived3 = /*#__PURE__*/ function(Derived1) {
    "use strict";
    swcHelpers.inherits(Derived3, Derived1);
    var _super = swcHelpers.createSuper(Derived3);
    function Derived3() {
        swcHelpers.classCallCheck(this, Derived3);
        return _super.apply(this, arguments);
    }
    var _proto4 = Derived3.prototype;
    _proto4.method3 = function method3() {
        var D = /*#__PURE__*/ function() {
            function D() {
                swcHelpers.classCallCheck(this, D);
            }
            var _proto = D.prototype;
            _proto.method3d = function method3d() {
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
            return D;
        }();
    };
    return Derived3;
}(Derived1);
var Derived4 = /*#__PURE__*/ function(Derived2) {
    "use strict";
    swcHelpers.inherits(Derived4, Derived2);
    var _super = swcHelpers.createSuper(Derived4);
    function Derived4() {
        swcHelpers.classCallCheck(this, Derived4);
        return _super.apply(this, arguments);
    }
    var _proto5 = Derived4.prototype;
    _proto5.method4 = function method4() {
        var E = /*#__PURE__*/ function() {
            function E() {
                swcHelpers.classCallCheck(this, E);
            }
            var _proto = E.prototype;
            _proto.method4e = function method4e() {
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
            return E;
        }();
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
