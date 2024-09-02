//// [classConstructorParametersAccessibility3.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base(p) {
    "use strict";
    _class_call_check(this, Base);
    this.p = p;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    function Derived(p) {
        _class_call_check(this, Derived);
        var _this;
        _this = _call_super(this, Derived, [
            p
        ]), _this.p = p;
        _this.p; // OK
        return _this;
    }
    return Derived;
}(Base);
var d;
d.p; // public, OK
