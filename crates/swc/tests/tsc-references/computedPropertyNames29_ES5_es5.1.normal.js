import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
// @target: es5
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
