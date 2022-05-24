import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    _class_call_check(this, C);
};
C.f = 1, C.arrowFunctionBoundary = function() {
    return C.f + 1;
}, C.functionExprBoundary = function() {
    return this.f + 2;
}, C.classExprBoundary = function _class() {
    "use strict";
    _class_call_check(this, _class), this.a = this.f + 3;
}, C.functionAndClassDeclBoundary = function() {
    var CC = function() {
        "use strict";
        function CC() {
            _class_call_check(this, CC), this.a = this.f + 5;
        }
        return CC.prototype.method = function() {
            return this.f + 6;
        }, CC;
    }();
}();
