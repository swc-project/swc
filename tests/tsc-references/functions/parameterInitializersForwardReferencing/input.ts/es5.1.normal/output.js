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
function right(param, param2) {
    var a = param === void 0 ? b : param, b1 = param2 === void 0 ? a : param2;
    a;
    b1;
}
function right2(param, param3, param4) {
    var a = param === void 0 ? b : param, b2 = param3 === void 0 ? c : param3, c1 = param4 === void 0 ? a : param4;
    a;
    b2;
    c1;
}
function inside(param) {
    var a = param === void 0 ? b : param;
    var b3;
}
function outside() {
    var inside = function inside(param) {
        var a = param === void 0 ? b : param;
        var b4;
    };
    var b;
}
function defaultArgFunction(param, param5) {
    var a = param === void 0 ? function() {
        return b;
    } : param, b5 = param5 === void 0 ? 1 : param5;
}
function defaultArgArrow(param, param6) {
    var a = param === void 0 ? function() {
        return function() {
            return b;
        };
    } : param, b6 = param6 === void 0 ? 3 : param6;
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C(param, param7) {
        var a = param === void 0 ? b : param, b7 = param7 === void 0 ? 1 : param7;
        _classCallCheck(this, C);
    }
    _createClass(C, [
        {
            key: "method",
            value: function method(param, param8) {
                var a = param === void 0 ? b : param, b8 = param8 === void 0 ? 1 : param8;
            }
        }
    ]);
    return C;
}();
// Function expressions
var x = function(param, param9, param10) {
    var a = param === void 0 ? b : param, b9 = param9 === void 0 ? c : param9, c2 = param10 === void 0 ? d : param10;
    var d1;
};
// Should not produce errors - can reference later parameters if they occur within a function expression initializer.
function f(a, param, param11) {
    var b = param === void 0 ? function() {
        return c;
    } : param, c3 = param11 === void 0 ? b() : param11;
}
