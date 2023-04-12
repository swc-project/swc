//// [constructorFunctionTypeIsAssignableToBaseType2.ts]
// the constructor function itself does not need to be a subtype of the base type constructor function
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _possible_constructor_return } from "@swc/helpers/_/_possible_constructor_return";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Base = function Base(x) {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(x) {
        _class_call_check(this, Derived);
        return _super.call(this, x);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived2, Base);
    var _super = _create_super(Derived2);
    function Derived2(x) {
        _class_call_check(this, Derived2);
        var _this = _super.call(this, x);
        return _possible_constructor_return(_this, 1);
    }
    return Derived2;
}(Base);
