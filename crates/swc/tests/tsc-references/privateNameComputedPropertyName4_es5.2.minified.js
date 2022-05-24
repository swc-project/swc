import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C1 = function() {
    "use strict";
    function C1() {
        _class_call_check(this, C1);
    }
    return C1.prototype.bar = function() {}, C1;
}(), C2 = function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.bar = function() {}, C2;
}(), C3 = function() {
    "use strict";
    _class_call_check(this, C3);
};
C3.bar = "test";
