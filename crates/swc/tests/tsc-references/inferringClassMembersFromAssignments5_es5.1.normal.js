import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @noImplicitAny: true
// @strictNullChecks: true
// @Filename: a.js
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
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        var _this;
        _this = _super.call(this);
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
