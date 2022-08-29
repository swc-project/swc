//// [duplicateStringIndexers.ts]
// it is an error to have duplicate index signatures of the same kind in a type
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var test;
(function(test) {
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    var a;
})(test || (test = {}));
