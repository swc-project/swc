import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
} // error
;
var C = ""; // error
var M;
(function(M) {
    var D = function D() {
        "use strict";
        _class_call_check(this, D);
    };
    var D = 1; // error
})(M || (M = {}));
