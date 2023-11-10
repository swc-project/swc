//// [privateStaticMemberAccessibility.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Base = function Base() {
    _class_call_check(this, Base);
};
(function(Base1) {
    _inherits(Derived, Base1);
    var _super = _create_super(Derived);
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _this = _super.apply(this, arguments), _this.bing = function() {
            return Base.foo;
        }, _this;
    }
    return Derived;
})(Base).bar = Base.foo;
