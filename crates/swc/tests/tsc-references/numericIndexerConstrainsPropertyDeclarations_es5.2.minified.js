import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
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
