import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var d2, Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(function() {
    "use strict";
    function Base(x) {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    return _proto.b = function() {}, Base.s = function() {}, _create_class(Base, [
        {
            key: "c",
            get: function() {
                return "";
            },
            set: function(v) {}
        }
    ], [
        {
            key: "t",
            get: function() {
                return "";
            },
            set: function(v) {}
        }
    ]), Base;
}()), d = new Derived(1);
d.a, d.b(), d.c, d.c = "", Derived.r, Derived.s(), Derived.t, Derived.t = "", d2[""], d2[1];
