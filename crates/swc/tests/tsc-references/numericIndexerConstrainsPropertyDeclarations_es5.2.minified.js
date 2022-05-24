import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {
        return "";
    }, C.foo = function() {}, _create_class(C, [
        {
            key: "X",
            get: function() {
                return "";
            },
            set: function(v) {}
        }
    ], [
        {
            key: "X",
            get: function() {
                return 1;
            }
        }
    ]), C;
}();
