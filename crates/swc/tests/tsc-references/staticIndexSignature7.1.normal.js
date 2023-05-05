//// [staticIndexSignature7.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
