import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
// @target: es6
var B = /*#__PURE__*/ function() {
    "use strict";
    function B(a) {
        _class_call_check(this, B);
        this.B = a;
    }
    var _proto = B.prototype;
    _proto.foo = function foo() {
        return this.x;
    };
    _create_class(B, [
        {
            key: "BB",
            get: function get() {
                return this.B;
            }
        },
        {
            key: "BBWith",
            set: function set(c) {
                this.B = c;
            }
        }
    ]);
    return B;
}();
