import * as swcHelpers from "@swc/helpers";
var b, d1, d2, d3, d4, Base = function() {
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.method = function() {
        var A = function() {
            function A() {
                swcHelpers.classCallCheck(this, A);
            }
            return A.prototype.methoda = function() {
                var d11, d21, d31, d41;
                (void 0).x, d11.x, d21.x, d31.x, d41.x;
            }, A;
        }();
    }, Base;
}(), Derived1 = function(Base) {
    swcHelpers.inherits(Derived1, Base);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        return swcHelpers.classCallCheck(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1.prototype.method1 = function() {
        var B = function() {
            function B() {
                swcHelpers.classCallCheck(this, B);
            }
            return B.prototype.method1b = function() {
                var d12, d22, d32, d42;
                (void 0).x, d12.x, d22.x, d32.x, d42.x;
            }, B;
        }();
    }, Derived1;
}(Base), Derived2 = function(Base) {
    swcHelpers.inherits(Derived2, Base);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2.prototype.method2 = function() {
        var C = function() {
            function C() {
                swcHelpers.classCallCheck(this, C);
            }
            return C.prototype.method2c = function() {
                var d13, d23, d33, d43;
                (void 0).x, d13.x, d23.x, d33.x, d43.x;
            }, C;
        }();
    }, Derived2;
}(Base), Derived3 = function(Derived1) {
    swcHelpers.inherits(Derived3, Derived1);
    var _super = swcHelpers.createSuper(Derived3);
    function Derived3() {
        return swcHelpers.classCallCheck(this, Derived3), _super.apply(this, arguments);
    }
    return Derived3.prototype.method3 = function() {
        var D = function() {
            function D() {
                swcHelpers.classCallCheck(this, D);
            }
            return D.prototype.method3d = function() {
                var d14, d24, d34, d44;
                (void 0).x, d14.x, d24.x, d34.x, d44.x;
            }, D;
        }();
    }, Derived3;
}(Derived1), Derived4 = function(Derived2) {
    swcHelpers.inherits(Derived4, Derived2);
    var _super = swcHelpers.createSuper(Derived4);
    function Derived4() {
        return swcHelpers.classCallCheck(this, Derived4), _super.apply(this, arguments);
    }
    return Derived4.prototype.method4 = function() {
        var E = function() {
            function E() {
                swcHelpers.classCallCheck(this, E);
            }
            return E.prototype.method4e = function() {
                var d15, d25, d35, d45;
                (void 0).x, d15.x, d25.x, d35.x, d45.x;
            }, E;
        }();
    }, Derived4;
}(Derived2);
b.x, d1.x, d2.x, d3.x, d4.x;
