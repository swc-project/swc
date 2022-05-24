import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var tmp = "" + "", tmp1 = "" + "", tmp2 = "" + "";
// @target: es5
// @declaration: true
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto[tmp] = function() {};
    _create_class(C, [
        {
            key: tmp1,
            get: function get() {
                return 0;
            }
        },
        {
            key: tmp2,
            set: function set(x) {}
        }
    ]);
    return C;
}();
