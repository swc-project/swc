import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B), this.x = 10, this.x = 10;
    }
    return B.prototype.foo = function() {
        B.log(this.x);
    }, B.log = function(a) {}, _create_class(B, [
        {
            key: "X",
            get: function() {
                return this.x;
            }
        },
        {
            key: "bX",
            set: function(y) {
                this.x = y;
            }
        }
    ]), B;
}();
