import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
// @target: es5
// In the body of a get accessor with no return type annotation,
// if a matching set accessor exists and that set accessor has a parameter type annotation,
// return expressions are contextually typed by the type given in the set accessor's parameter type annotation.
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    _create_class(C, [
        {
            key: "X",
            get: function get() {
                return "string"; // Error; get contextual type by set accessor parameter type annotation
            },
            set: function set(x) {}
        },
        {
            key: "Y",
            get: function get() {
                return true;
            },
            set: function set(y) {}
        },
        {
            key: "W",
            get: function get() {
                return true;
            },
            set: function set(w) {}
        },
        {
            key: "Z",
            get: function get() {
                return 1;
            },
            set: function set(z) {}
        }
    ]);
    return C;
}();
