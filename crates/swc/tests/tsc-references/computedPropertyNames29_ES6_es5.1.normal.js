import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
// @target: es6
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.bar = function bar() {
        var _this = this;
        (function() {
            var obj = _define_property({}, _this.bar(), function() {} // needs capture
            );
        });
        return 0;
    };
    return C;
}();
