//// [computedPropertyNames28_ES5.ts]
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
        _class_call_check(this, C);
        var _this;
        _this = _call_super(this, C);
        var obj = _define_property({}, (_this = _call_super(this, C), "prop"), function() {});
        return _this;
    }
    return C;
}(Base);
