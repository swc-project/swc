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
function left(a, param, param1) {
    var b = param === void 0 ? a : param, c = param1 === void 0 ? b : param1;
    a;
    b;
}
function right(param, param1) {
    var a = param === void 0 ? b : param, b1 = param1 === void 0 ? a : param1;
    a;
    b1;
}
function right2(param, param1, param2) {
    var a = param === void 0 ? b : param, b1 = param1 === void 0 ? c : param1, c1 = param2 === void 0 ? a : param2;
    a;
    b1;
    c1;
}
function inside(param) {
    var a = param === void 0 ? b : param;
    var b1;
}
function outside() {
    var inside = function inside(param) {
        var a = param === void 0 ? b : param;
        var b1;
    };
    var b;
}
function defaultArgFunction(param, param1) {
    var a = param === void 0 ? function() {
        return b;
    } : param, b1 = param1 === void 0 ? 1 : param1;
}
function defaultArgArrow(param, param1) {
    var a = param === void 0 ? function() {
        return function() {
            return b;
        };
    } : param, b1 = param1 === void 0 ? 3 : param1;
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(param, param1) {
        var a = param === void 0 ? b : param, b1 = param1 === void 0 ? 1 : param1;
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "method",
            value: function method(param, param1) {
                var a = param === void 0 ? b : param, b1 = param1 === void 0 ? 1 : param1;
            }
        }
    ]);
    return C;
}();
// Function expressions
var x = function(param, param1, param2) {
    var a = param === void 0 ? b : param, b1 = param1 === void 0 ? c : param1, c1 = param2 === void 0 ? d : param2;
    var d1;
};
// Should not produce errors - can reference later parameters if they occur within a function expression initializer.
function f(a, param, param1) {
    var b = param === void 0 ? function() {
        return c;
    } : param, c1 = param1 === void 0 ? b() : param1;
}
