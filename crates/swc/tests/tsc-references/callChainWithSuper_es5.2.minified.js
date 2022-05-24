import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
