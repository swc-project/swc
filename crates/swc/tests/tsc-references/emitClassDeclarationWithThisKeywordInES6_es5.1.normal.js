import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
// @target: es6
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
        this.x = 10;
        this.x = 10;
    }
    var _proto = B.prototype;
    _proto.foo = function foo() {
        B.log(this.x);
    };
    B.log = function log(a) {};
    _create_class(B, [
        {
            key: "X",
            get: function get() {
                return this.x;
            }
        },
        {
            key: "bX",
            set: function set(y) {
                this.x = y;
            }
        }
    ]);
    return B;
}();
