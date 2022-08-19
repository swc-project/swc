import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var B = function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
    }
    var _proto = B.prototype;
    return _proto.print = function() {
        return "I am B";
    }, B;
}();
!function(x) {
    x.then(function(value) {
        new value.B().print();
    });
}(import("./0"));
