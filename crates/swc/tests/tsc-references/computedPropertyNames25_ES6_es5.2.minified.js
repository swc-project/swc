import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.prototype.bar = function() {
        return 0;
    }, Base;
}(), C = function(Base) {
    "use strict";
    _inherits(C, Base);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C.prototype.foo = function() {
        return _define_property({}, _get(_get_prototype_of(C.prototype), "bar", this).call(this), function() {}), 0;
    }, C;
}(Base);
