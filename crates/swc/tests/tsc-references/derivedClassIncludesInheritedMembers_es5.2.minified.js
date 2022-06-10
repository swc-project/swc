import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var d2, Base = function() {
    "use strict";
    function Base(x) {
        _class_call_check(this, Base);
    }
    return Base.prototype.b = function() {}, Base.s = function() {}, _create_class(Base, [
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
}(), Derived = function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        return _class_call_check(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), d = new Derived(1);
d.a, d.b(), d.c, d.c = "", Derived.r, Derived.s(), Derived.t, Derived.t = "";
var Base2 = function() {
    "use strict";
    _class_call_check(this, Base2);
}, Derived2 = function(Base21) {
    "use strict";
    _inherits(Derived2, Base21);
    var _super = _create_super(Derived2);
    function Derived2() {
        return _class_call_check(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base2);
d2[""], d2[1];
