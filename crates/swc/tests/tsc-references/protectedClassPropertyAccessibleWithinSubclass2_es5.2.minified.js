import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var b, d1, d2, d3, d4, Base = function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.prototype.method = function() {
        var d1, d2, d3, d4;
        (void 0).x, d1.x, d2.x, d3.x, d4.x;
    }, Base;
}(), Derived1 = function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _create_super(Derived1);
    function Derived1() {
        return _class_call_check(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1.prototype.method1 = function() {
        var d1, d2, d3, d4;
        (void 0).x, d1.x, d2.x, d3.x, d4.x;
    }, Derived1;
}(Base), Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2.prototype.method2 = function() {
        var d1, d2, d3, d4;
        (void 0).x, d1.x, d2.x, d3.x, d4.x;
    }, Derived2;
}(Base), Derived3 = function(Derived1) {
    "use strict";
    _inherits(Derived3, Derived1);
    var _super = _create_super(Derived3);
    function Derived3() {
        return _class_call_check(this, Derived3), _super.apply(this, arguments);
    }
    return Derived3.prototype.method3 = function() {
        var d1, d2, d3, d4;
        (void 0).x, d1.x, d2.x, d3.x, d4.x;
    }, Derived3;
}(Derived1), Derived4 = function(Derived2) {
    "use strict";
    _inherits(Derived4, Derived2);
    var _super = _create_super(Derived4);
    function Derived4() {
        return _class_call_check(this, Derived4), _super.apply(this, arguments);
    }
    return Derived4.prototype.method4 = function() {
        var d1, d2, d3, d4;
        (void 0).x, d1.x, d2.x, d3.x, d4.x;
    }, Derived4;
}(Derived2);
b.x, d1.x, d2.x, d3.x, d4.x;
