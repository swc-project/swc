//// [derivedClassConstructorWithoutSuperCall.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _possible_constructor_return from "@swc/helpers/src/_possible_constructor_return.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Base) {
    "use strict";
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _possible_constructor_return(_this);
    }
    return _inherits(Derived, Base), _create_super(Derived), Derived;
}(function Base() {
    "use strict";
    _class_call_check(this, Base);
});
