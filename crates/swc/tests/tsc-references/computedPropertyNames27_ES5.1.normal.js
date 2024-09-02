//// [computedPropertyNames27_ES5.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var _tmp = (super(), "prop");
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(C, Base);
    function C() {
        _class_call_check(this, C);
        return _call_super(this, C, arguments);
    }
    var _proto = C.prototype;
    _proto[_tmp] = function() {};
    return C;
}(Base);
