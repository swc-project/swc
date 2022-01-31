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
function left(a) {
    var b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : a, c = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : b;
    a;
    b;
}
function right() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b, b1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : a;
    a;
    b1;
}
function right2() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b, b2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : c, c1 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : a;
    a;
    b2;
    c1;
}
function inside() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b;
    var b;
}
function outside() {
    var inside = function inside() {
        var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b;
        var b;
    };
    var b;
}
function defaultArgFunction() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
        return b;
    }, b3 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
}
function defaultArgArrow() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
        return function() {
            return b;
        };
    }, b4 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 3;
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b, b5 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "method",
            value: function method() {
                var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b, b6 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
            }
        }
    ]);
    return C;
}();
// Function expressions
var x = function() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b, b7 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : c, c2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : d;
    var d;
};
// Should not produce errors - can reference later parameters if they occur within a function expression initializer.
function f(a) {
    var b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
        return c;
    }, c3 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : b();
}
