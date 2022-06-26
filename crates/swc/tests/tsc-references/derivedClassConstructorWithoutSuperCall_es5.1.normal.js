import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _possible_constructor_return from "@swc/helpers/src/_possible_constructor_return.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// derived class constructors must contain a super call
var Base = function Base() {
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
        return _possible_constructor_return(_this);
    }
    return Derived;
}(Base);
var Base2 = function Base2() {
    "use strict";
    _class_call_check(this, Base2);
};
var Derived2 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived2, Base2);
    var _super = _create_super(Derived2);
    function Derived2() {
        var _this = this;
        _class_call_check(this, Derived2);
        var _this1;
        var r2 = function() {
            return _this1 = _super.call(_this);
        }; // error for misplaced super call (nested function)
        return _possible_constructor_return(_this1);
    }
    return Derived2;
}(Base2);
var Derived3 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived3, Base2);
    var _super = _create_super(Derived3);
    function Derived3() {
        _class_call_check(this, Derived3);
        var _this;
        var r = function r() {
            super();
        } // error
        ;
        return _possible_constructor_return(_this);
    }
    return Derived3;
}(Base2);
var Derived4 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived4, Base2);
    var _super = _create_super(Derived4);
    function Derived4() {
        _class_call_check(this, Derived4);
        var _this;
        var r = _this = _super.call(this); // ok
        return _possible_constructor_return(_this);
    }
    return Derived4;
}(Base2);
