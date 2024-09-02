//// [a.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.m = function m() {
        this.p = 1;
    };
    return Base;
}();
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived() {
        _class_call_check(this, Derived);
        var _this;
        _this = _call_super(this, Derived);
        // should be OK, and p should have type number from this assignment
        _this.p = 1;
        return _this;
    }
    var _proto = Derived.prototype;
    _proto.test = function test() {
        return this.p;
    };
    return Derived;
}(Base);
