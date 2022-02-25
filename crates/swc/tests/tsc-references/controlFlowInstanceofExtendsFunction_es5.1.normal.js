function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
Function.prototype.now = function() {
    return "now";
};
var X = /*#__PURE__*/ function() {
    "use strict";
    function X() {
        _classCallCheck(this, X);
    }
    _createClass(X, [
        {
            key: "why",
            value: function why() {}
        }
    ], [
        {
            key: "now",
            value: function now() {
                return {};
            }
        }
    ]);
    return X;
}();
var Y = function Y() {
    "use strict";
    _classCallCheck(this, Y);
};
console.log(X.now()) // works as expected
;
console.log(Y.now()) // works as expected
;
export var x = Math.random() > 0.5 ? new X() : 1;
if (_instanceof(x, X)) {
    x.why() // should compile
    ;
}
