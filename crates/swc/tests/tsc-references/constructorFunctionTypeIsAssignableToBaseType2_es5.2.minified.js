import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _possible_constructor_return from "@swc/helpers/src/_possible_constructor_return.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function(x) {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    var _super = _create_super(Derived);
    function Derived(x) {
        return _class_call_check(this, Derived), _super.call(this, x);
    }
    return Derived;
}(Base), Derived2 = function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    var _super = _create_super(Derived2);
    function Derived2(x) {
        _class_call_check(this, Derived2);
        var _this = _super.call(this, x);
        return _possible_constructor_return(_this, 1);
    }
    return Derived2;
}(Base);
