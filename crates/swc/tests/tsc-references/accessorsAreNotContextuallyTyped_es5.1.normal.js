import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
// accessors are not contextually typed
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
        {
            key: "x",
            get: function get() {
                return function(x) {
                    return "";
                };
            },
            set: function set(v) {}
        }
    ]);
    return C;
}();
var c;
var r = c.x(""); // string
