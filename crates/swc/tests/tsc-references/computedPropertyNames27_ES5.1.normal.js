//// [computedPropertyNames27_ES5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var _tmp = (super(), "prop");
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(C, Base);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    _proto[_tmp] = function() {};
    return C;
}(Base);
