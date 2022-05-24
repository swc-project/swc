import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
// @target: es5
// no errors expected
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.y = function y(a) {
        return null;
    };
    _create_class(C, [
        {
            key: "z",
            get: function get() {
                return 1;
            },
            set: function set(v) {}
        }
    ]);
    return C;
}();
var c;
var i;
c = i;
i = c;
