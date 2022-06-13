import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
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
