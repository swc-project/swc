import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var B = function() {
    "use strict";
    function B(a) {
        _class_call_check(this, B), this.B = a;
    }
    return B.prototype.foo = function() {
        return this.x;
    }, _create_class(B, [
        {
            key: "BB",
            get: function() {
                return this.B;
            }
        },
        {
            key: "BBWith",
            set: function(c) {
                this.B = c;
            }
        }
    ]), B;
}();
