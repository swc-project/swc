//// [computedPropertyNames30_ES5.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(C, Base);
    function C() {
        var _this = this;
        _class_call_check(this, C);
        var _this1;
        _this1 = _call_super(this, C);
        (function() {
            var obj = // Ideally, we would capture this. But the reference is
            // illegal, and not capturing this is consistent with
            //treatment of other similar violations.
            _define_property({}, (_this1 = _call_super(_this, C), "prop"), function() {});
        });
        return _this1;
    }
    return C;
}(Base);
