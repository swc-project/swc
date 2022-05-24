import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @strict: true
var X = function X() {
    "use strict";
    _class_call_check(this, X);
};
X.x = 12 // Should error, incompatible with index signature
;
var Y = /*#__PURE__*/ function() {
    "use strict";
    function Y() {
        _class_call_check(this, Y);
    }
    Y.foo // should error, incompatible with index signature
     = function foo() {};
    return Y;
}();
