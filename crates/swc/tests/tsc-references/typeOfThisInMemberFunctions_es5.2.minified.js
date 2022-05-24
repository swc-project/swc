import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function() {}, C.bar = function() {}, C;
}(), D = function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    return D.prototype.foo = function() {}, D.bar = function() {}, D;
}(), E = function() {
    "use strict";
    function E() {
        _class_call_check(this, E);
    }
    return E.prototype.foo = function() {}, E.bar = function() {}, E;
}();
