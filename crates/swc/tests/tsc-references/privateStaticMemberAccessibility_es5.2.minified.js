import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function() {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    var _super = _create_super(Derived);
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _this = _super.apply(this, arguments), _this.bing = function() {
            return Base.foo;
        }, _this;
    }
    return Derived;
}(Base);
Derived.bar = Base.foo;
