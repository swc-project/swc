//// [derivedClassConstructorWithoutSuperCall.ts]
// derived class constructors must contain a super call
import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _class_call_check(this, Derived);
        return _assert_this_initialized(void 0);
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
    function Derived2() {
        var _this = this;
        _class_call_check(this, Derived2);
        var _this1;
        var r2 = function() {
            return _this1 = _call_super(_this, Derived2);
        }; // error for misplaced super call (nested function)
        return _assert_this_initialized(_this1);
    }
    return Derived2;
}(Base2);
var Derived3 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived3, Base2);
    function Derived3() {
        _class_call_check(this, Derived3);
        var r = function r() {
            super();
        } // error
        ;
        return _assert_this_initialized(void 0);
    }
    return Derived3;
}(Base2);
var Derived4 = /*#__PURE__*/ function(Base2) {
    "use strict";
    _inherits(Derived4, Base2);
    function Derived4() {
        _class_call_check(this, Derived4);
        var _this;
        var r = _this = _call_super(this, Derived4); // ok
        return _this;
    }
    return Derived4;
}(Base2);
