//// [derivedClassSuperCallsWithThisArg.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function Base(a) {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _this = _super.call(this, _assert_this_initialized(_this));
    }
    return Derived;
}(Base), Derived2 = function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2(a) {
        var _this;
        return _class_call_check(this, Derived2), (_this = _super.call(this, _assert_this_initialized(_this))).a = a, _this;
    }
    return Derived2;
}(Base), Derived3 = function(Base) {
    "use strict";
    _inherits(Derived3, Base);
    var _super = _create_super(Derived3);
    function Derived3(a) {
        var _this;
        return _class_call_check(this, Derived3), (_this = _super.call(this, function() {
            return _assert_this_initialized(_this);
        })).a = a, _this;
    }
    return Derived3;
}(Base), Derived4 = function(Base) {
    "use strict";
    _inherits(Derived4, Base);
    var _super = _create_super(Derived4);
    function Derived4(a) {
        var _this;
        return _class_call_check(this, Derived4), (_this = _super.call(this, function() {
            return this;
        })).a = a, _this;
    }
    return Derived4;
}(Base);
