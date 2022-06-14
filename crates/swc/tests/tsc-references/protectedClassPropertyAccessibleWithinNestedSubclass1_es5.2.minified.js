import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var b, d1, d2, d3, d4, Base = function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.prototype.method = function() {
        var A = function() {
            function A() {
                _class_call_check(this, A);
            }
            return A.prototype.methoda = function() {
                var d11, d21, d31, d41;
                (void 0).x, d11.x, d21.x, d31.x, d41.x;
            }, A;
        }();
    }, Base;
}(), Derived1 = function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _create_super(Derived1);
    function Derived1() {
        return _class_call_check(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1.prototype.method1 = function() {
        var B = function() {
            function B() {
                _class_call_check(this, B);
            }
            return B.prototype.method1b = function() {
                var d12, d22, d32, d42;
                (void 0).x, d12.x, d22.x, d32.x, d42.x;
            }, B;
        }();
    }, Derived1;
}(Base), Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2.prototype.method2 = function() {
        var C = function() {
            function C() {
                _class_call_check(this, C);
            }
            return C.prototype.method2c = function() {
                var d13, d23, d33, d43;
                (void 0).x, d13.x, d23.x, d33.x, d43.x;
            }, C;
        }();
    }, Derived2;
}(Base), Derived3 = function(Derived1) {
    "use strict";
    _inherits(Derived3, Derived1);
    var _super = _create_super(Derived3);
    function Derived3() {
        return _class_call_check(this, Derived3), _super.apply(this, arguments);
    }
    return Derived3.prototype.method3 = function() {
        var D = function() {
            function D() {
                _class_call_check(this, D);
            }
            return D.prototype.method3d = function() {
                var d14, d24, d34, d44;
                (void 0).x, d14.x, d24.x, d34.x, d44.x;
            }, D;
        }();
    }, Derived3;
}(Derived1), Derived4 = function(Derived2) {
    "use strict";
    _inherits(Derived4, Derived2);
    var _super = _create_super(Derived4);
    function Derived4() {
        return _class_call_check(this, Derived4), _super.apply(this, arguments);
    }
    return Derived4.prototype.method4 = function() {
        var E = function() {
            function E() {
                _class_call_check(this, E);
            }
            return E.prototype.method4e = function() {
                var d15, d25, d35, d45;
                (void 0).x, d15.x, d25.x, d35.x, d45.x;
            }, E;
        }();
    }, Derived4;
}(Derived2);
b.x, d1.x, d2.x, d3.x, d4.x;
