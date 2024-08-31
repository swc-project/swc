//// [computedPropertyNames26_ES5.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        _class_call_check(this, Base);
    }
    var _proto = Base.prototype;
    _proto.bar = function bar() {
        return 0;
    };
    return Base;
}();
var _ = _define_property({}, super.bar(), 1)[0];
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(C, Base);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    var _proto = C.prototype;
    _proto[_] = function() {};
    return C;
}(Base);
