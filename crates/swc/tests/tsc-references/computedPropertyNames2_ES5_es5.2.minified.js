import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var methodName = "method", accessorName = "accessor", _methodName = methodName, _methodName1 = methodName, _accessorName = accessorName, _accessorName1 = accessorName, _accessorName2 = accessorName, _accessorName3 = accessorName, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype[_methodName] = function() {}, C[_methodName1] = function() {}, _create_class(C, [
        {
            key: _accessorName,
            get: function() {}
        },
        {
            key: _accessorName1,
            set: function(v) {}
        }
    ], [
        {
            key: _accessorName2,
            get: function() {}
        },
        {
            key: _accessorName3,
            set: function(v) {}
        }
    ]), C;
}();
