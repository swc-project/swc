import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
    var _super = _create_super(Derived1);
    function Derived1() {
        _class_call_check(this, Derived1);
        return _super.apply(this, arguments);
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
    var _super = _create_super(Derived2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _super.apply(this, arguments);
    }
    Derived2.staticMethod3 = function staticMethod3() {
        this.x; // OK, accessed within a class derived from their declaring class
        _get(_get_prototype_of(Derived2), "x", this); // Error, x is not public
    };
    return Derived2;
}(Derived1);
