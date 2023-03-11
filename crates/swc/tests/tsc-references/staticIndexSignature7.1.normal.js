//// [staticIndexSignature7.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var X = function X() {
    "use strict";
    _class_call_check(this, X);
};
(function() {
    X.x = 12 // Should error, incompatible with index signature
    ;
})();
var Y = /*#__PURE__*/ function() {
    "use strict";
    function Y() {
        _class_call_check(this, Y);
    }
    Y.foo // should error, incompatible with index signature
     = function foo() {};
    return Y;
}();
