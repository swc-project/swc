import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
// @target: es6
// @declaration: true
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    C["" + ""] = function() {};
    _create_class(C, null, [
        {
            key: "" + "",
            get: function get() {
                return 0;
            }
        },
        {
            key: "" + "",
            set: function set(x) {}
        }
    ]);
    return C;
}();
