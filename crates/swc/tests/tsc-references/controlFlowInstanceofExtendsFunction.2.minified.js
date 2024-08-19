//// [controlFlowInstanceofExtendsFunction.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
Function.prototype.now = function() {
    return "now";
};
var X = /*#__PURE__*/ function() {
    function X() {
        _class_call_check(this, X);
    }
    return X.prototype.why = function() {}, X.now = function() {
        return {};
    }, X;
}();
console.log(X.now()), console.log((function Y() {
    _class_call_check(this, Y);
}).now());
export var x = Math.random() > 0.5 ? new X() : 1;
_instanceof(x, X) && x.why();
