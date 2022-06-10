import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
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
