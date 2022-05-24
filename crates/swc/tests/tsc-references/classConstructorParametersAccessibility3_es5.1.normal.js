import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function Base(p) {
    "use strict";
    _class_call_check(this, Base);
    this.p = p;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(p) {
        _class_call_check(this, Derived);
        var _this;
        _this = _super.call(this, p);
        _this.p = p;
        _this.p; // OK
        return _this;
    }
    return Derived;
}(Base);
var d;
d.p; // public, OK
