import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
var tmp = _define_property({}, this.bar(), 1)[0], C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.bar = function() {
        return 0;
    }, _proto[tmp] = function() {}, C;
}();
