import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var methodName = "method", accessorName = "accessor", C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype[methodName] = function() {}, C[methodName] = function() {}, _create_class(C, [
        {
            key: accessorName,
            get: function() {}
        },
        {
            key: accessorName,
            set: function(v) {}
        }
    ], [
        {
            key: accessorName,
            get: function() {}
        },
        {
            key: accessorName,
            set: function(v) {}
        }
    ]), C;
}();
