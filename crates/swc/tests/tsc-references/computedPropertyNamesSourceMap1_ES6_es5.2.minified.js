import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.hello = function() {}, _create_class(C, [
        {
            key: "goodbye",
            get: function() {
                return 0;
            }
        }
    ]), C;
}();
