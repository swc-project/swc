//// [derivedClassSuperCallsWithThisArg.ts]
import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function Base(a) {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        var _this;
        _this = _super.call(this, _assert_this_initialized(_this)); // ok
        return _this;
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2(a) {
        _class_call_check(this, Derived2);
        var _this;
        _this = _super.call(this, _assert_this_initialized(_this)); // error
        _this.a = a;
        return _this;
    }
    return Derived2;
}(Base);
var Derived3 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived3, Base);
    var _super = _create_super(Derived3);
    function Derived3(a) {
        _class_call_check(this, Derived3);
        var _this;
        _this = _super.call(this, function() {
            return _assert_this_initialized(_this);
        }); // error
        _this.a = a;
        return _this;
    }
    return Derived3;
}(Base);
var Derived4 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived4, Base);
    var _super = _create_super(Derived4);
    function Derived4(a) {
        _class_call_check(this, Derived4);
        var _this;
        _this = _super.call(this, function() {
            return this;
        }); // ok
        _this.a = a;
        return _this;
    }
    return Derived4;
}(Base);
