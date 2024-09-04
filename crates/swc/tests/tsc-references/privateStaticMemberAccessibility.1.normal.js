//// [privateStaticMemberAccessibility.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(Derived, Base1);
    function Derived() {
        _class_call_check(this, Derived);
        var _this;
        _this = _call_super(this, Derived, arguments), _this.bing = function() {
            return Base.foo;
        } // error
        ;
        return _this;
    }
    return Derived;
}(Base);
Derived.bar = Base.foo // error
;
