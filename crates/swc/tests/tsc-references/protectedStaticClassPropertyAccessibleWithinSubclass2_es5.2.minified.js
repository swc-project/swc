import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.staticMethod = function() {
        this.x;
    }, Base;
}(), Derived1 = function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _create_super(Derived1);
    function Derived1() {
        return _class_call_check(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1.staticMethod1 = function() {
        this.x, _get(_get_prototype_of(Derived1), "x", this);
    }, Derived1;
}(Base), Derived2 = function(Derived1) {
    "use strict";
    _inherits(Derived2, Derived1);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2.staticMethod3 = function() {
        this.x, _get(_get_prototype_of(Derived2), "x", this);
    }, Derived2;
}(Derived1);
