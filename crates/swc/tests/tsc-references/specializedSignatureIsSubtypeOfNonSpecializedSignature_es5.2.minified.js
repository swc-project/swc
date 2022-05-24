import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.foo = function(x) {}, C;
}(), C2 = function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.prototype.foo = function(x) {}, C2;
}(), C3 = function() {
    "use strict";
    function C3() {
        _class_call_check(this, C3);
    }
    return C3.prototype.foo = function(x) {}, C3;
}();
