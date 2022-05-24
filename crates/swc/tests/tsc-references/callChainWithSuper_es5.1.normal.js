import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @target: *,-es3
// @strict: true
// @noTypesAndSymbols: true
// GH#34952
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.method = function method() {};
    return Base;
}();
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        return _super.apply(this, arguments);
    }
    var _proto = Derived.prototype;
    _proto.method1 = function method1() {
        var ref;
        return (ref = _get(_get_prototype_of(Derived.prototype), "method", this)) === null || ref === void 0 ? void 0 : ref.call(this);
    };
    _proto.method2 = function method2() {
        var ref;
        return (ref = _get(_get_prototype_of(Derived.prototype), "method", this)) === null || ref === void 0 ? void 0 : ref.call(this);
    };
    return Derived;
}(Base);
