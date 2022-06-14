import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
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
