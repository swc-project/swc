import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var c, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {}, C.foo = function() {}, _create_class(C, [
        {
            key: "y",
            get: function() {
                return null;
            },
            set: function(x) {}
        }
    ], [
        {
            key: "b",
            get: function() {
                return null;
            },
            set: function(x) {}
        }
    ]), C;
}();
c.x, c.y, c.y = 1, c.foo(), C.a, C.b(), C.b = 1, C.foo();
