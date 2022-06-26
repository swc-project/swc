import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
