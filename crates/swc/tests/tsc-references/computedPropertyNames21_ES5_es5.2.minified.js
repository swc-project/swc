import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var tmp = this.bar(), C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.bar = function() {
        return 0;
    }, _proto[tmp] = function() {}, C;
}();
