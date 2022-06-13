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
    return Base.prototype.method = function() {}, Base;
}(), Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    var _proto = Derived.prototype;
    return _proto.method1 = function() {
        var ref;
        return null === (ref = _get(_get_prototype_of(Derived.prototype), "method", this)) || void 0 === ref ? void 0 : ref.call(this);
    }, _proto.method2 = function() {
        var ref;
        return null === (ref = _get(_get_prototype_of(Derived.prototype), "method", this)) || void 0 === ref ? void 0 : ref.call(this);
    }, Derived;
}(Base);
