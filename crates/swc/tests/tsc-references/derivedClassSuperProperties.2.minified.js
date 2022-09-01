//// [derivedClassSuperProperties.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _possible_constructor_return from "@swc/helpers/src/_possible_constructor_return.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Base) {
    "use strict";
    _inherits(Derived1, Base);
    var _super = _create_super(Derived1);
    function Derived1() {
        var _this;
        return _class_call_check(this, Derived1), _get((_assert_this_initialized(_this), _get_prototype_of(Derived1.prototype)), "receivesAnything", _this).call(_this), (_this = _super.call(this)).prop = !0, _possible_constructor_return(_this);
    }
    return Derived1;
}(function() {
    "use strict";
    function Base(a) {
        _class_call_check(this, Base);
    }
    return Base.prototype.receivesAnything = function(param) {}, Base;
}());
