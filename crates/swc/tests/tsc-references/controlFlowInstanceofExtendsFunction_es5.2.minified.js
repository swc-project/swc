import * as swcHelpers from "@swc/helpers";
Function.prototype.now = function() {
    return "now";
};
var X = function() {
    function X() {
        swcHelpers.classCallCheck(this, X);
    }
    return X.prototype.why = function() {}, X.now = function() {
        return {};
    }, X;
}(), Y = function() {
    swcHelpers.classCallCheck(this, Y);
};
console.log(X.now()), console.log(Y.now());
export var x = Math.random() > 0.5 ? new X() : 1;
swcHelpers._instanceof(x, X) && x.why();
