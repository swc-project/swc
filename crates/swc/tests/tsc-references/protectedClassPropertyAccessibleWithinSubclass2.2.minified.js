//// [protectedClassPropertyAccessibleWithinSubclass2.ts]
var b, d1, d2, d3, d4;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Derived1) {
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
}(function(Base) {
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
}(function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.prototype.method = function() {
        var d1, d2, d3, d4;
        (void 0).x, d1.x, d2.x, d3.x, d4.x;
    }, Base;
}())), b.x, d1.x, d2.x, d3.x, d4.x;
