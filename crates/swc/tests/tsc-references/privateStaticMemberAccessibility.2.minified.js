//// [privateStaticMemberAccessibility.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    _class_call_check(this, Base);
};
/*#__PURE__*/ (function(Base1) {
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _this = _call_super(this, Derived, arguments), _this.bing = function() {
            return Base.foo;
        }, _this;
    }
    return _inherits(Derived, Base1), Derived;
})(Base).bar = Base.foo;
