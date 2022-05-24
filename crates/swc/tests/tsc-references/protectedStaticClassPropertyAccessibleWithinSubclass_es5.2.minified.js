import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.staticMethod = function() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }, Base;
}(), Derived1 = function(Base1) {
    "use strict";
    _inherits(Derived1, Base1);
    var _super = _create_super(Derived1);
    function Derived1() {
        return _class_call_check(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1.staticMethod1 = function() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }, Derived1;
}(Base), Derived2 = function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2.staticMethod2 = function() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }, Derived2;
}(Base), Derived3 = function(Derived11) {
    "use strict";
    _inherits(Derived3, Derived11);
    var _super = _create_super(Derived3);
    function Derived3() {
        return _class_call_check(this, Derived3), _super.apply(this, arguments);
    }
    return Derived3.staticMethod3 = function() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }, Derived3;
}(Derived1);
Base.x, Derived1.x, Derived2.x, Derived3.x;
