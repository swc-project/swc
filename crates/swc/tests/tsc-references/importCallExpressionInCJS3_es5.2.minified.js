import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
export var B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    return B.prototype.print = function() {
        return "I am B";
    }, B;
}();
!function(x) {
    x.then(function(value) {
        new value.B().print();
    });
}(import("./0"));
