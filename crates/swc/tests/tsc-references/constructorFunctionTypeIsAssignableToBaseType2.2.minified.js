//// [constructorFunctionTypeIsAssignableToBaseType2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(x) {
        return _class_call_check(this, Derived), _super.call(this, x);
    }
    return Derived;
}(function Base(x) {
    "use strict";
    _class_call_check(this, Base);
});
