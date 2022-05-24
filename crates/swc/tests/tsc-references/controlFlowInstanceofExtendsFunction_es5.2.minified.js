import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _instanceof from "@swc/helpers/lib/_instanceof.js";
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
}(), Y = function() {
    "use strict";
    _class_call_check(this, Y);
};
console.log(X.now()), console.log(Y.now());
export var x = Math.random() > 0.5 ? new X() : 1;
_instanceof(x, X) && x.why();
