import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    return Base.fn = function() {
        return "";
    }, _create_class(Base, null, [
        {
            key: "a",
            get: function() {
                return 1;
            },
            set: function(v) {}
        }
    ]), Base;
}(), Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived.fn = function() {
        return "";
    }, _create_class(Derived, null, [
        {
            key: "a",
            get: function() {
                return 1;
            },
            set: function(v) {}
        }
    ]), Derived;
}(Base);
