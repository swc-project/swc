//// [classConstructorAccessibility4.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    return A.prototype.method = function() {}, A;
}(), D = function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    return D.prototype.method = function() {}, D;
}();
