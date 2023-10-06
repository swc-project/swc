//// [parameterInitializersForwardReferencing.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function left(a) {
    var b1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : a, c = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : b1;
    a;
    b1;
}
function right() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b1, b1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : a;
    a;
    b1;
}
function right2() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b1, b1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : c, c = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : a;
    a;
    b1;
    c;
}
function inside() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b;
    var _$b;
}
function outside() {
    var b1;
    function inside() {
        var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b1;
        var b2;
    }
}
function defaultArgFunction() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
        return b1;
    }, b1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
}
function defaultArgArrow() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
        return function() {
            return b1;
        };
    }, b1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 3;
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b1, b1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.method = function method() {
        var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b1, b1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
    };
    return C;
}();
// Function expressions
var x = function() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : b1, b1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : c, c = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : d;
    var _$d;
};
// Should not produce errors - can reference later parameters if they occur within a function expression initializer.
function f(a) {
    var b1 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
        return c;
    }, c = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : b1();
}
