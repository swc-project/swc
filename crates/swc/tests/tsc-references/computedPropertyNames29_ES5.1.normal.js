//// [computedPropertyNames29_ES5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
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
