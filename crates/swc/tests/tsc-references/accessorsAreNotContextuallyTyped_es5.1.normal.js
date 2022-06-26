import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
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
