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
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var result;
var result2;
if (!_instanceof(result, RegExp)) {
    result = result2;
} else if (!result.global) {
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "validate",
            value: function validate() {
                return {
                };
            }
        }
    ]);
    return C;
}();
function foo() {
    var v = null;
    if (_instanceof(v, C)) {
        v // Validator & Partial<OnChanges> & C
        ;
    }
    v // Validator & Partial<OnChanges> via subtype reduction
    ;
    if (v.onChanges) {
        v.onChanges({
        });
    }
}
