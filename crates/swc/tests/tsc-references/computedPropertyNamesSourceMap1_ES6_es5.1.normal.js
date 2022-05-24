import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
// @target: es6
// @sourceMap: true
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto["hello"] = function() {
        debugger;
    };
    _create_class(C, [
        {
            key: "goodbye",
            get: function get() {
                return 0;
            }
        }
    ]);
    return C;
}();
