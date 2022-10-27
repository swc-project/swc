//// [controlFlowInstanceofExtendsFunction.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
Function.prototype.now = function() {
    return "now";
};
var X = function() {
    "use strict";
    function X() {
        _class_call_check(this, X);
    }
    return X.prototype.why = function() {}, X.now = function() {
        return {};
    }, X;
}();
console.log(X.now()), console.log((function Y() {
    "use strict";
    _class_call_check(this, Y);
}).now());
export var x = Math.random() > 0.5 ? new X() : 1;
_instanceof(x, X) && x.why();
