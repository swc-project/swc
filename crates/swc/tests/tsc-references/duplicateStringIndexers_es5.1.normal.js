import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// it is an error to have duplicate index signatures of the same kind in a type
var test;
(function(test) {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    var a;
})(test || (test = {}));
