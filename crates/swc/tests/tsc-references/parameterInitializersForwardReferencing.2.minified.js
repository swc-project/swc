//// [parameterInitializersForwardReferencing.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function left(a) {
    arguments.length > 1 && void 0 !== arguments[1] && arguments[1], arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
}
function right() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : b, arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}
function right2() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : b, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : c, arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
}
function inside() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : b;
}
function outside() {}
function defaultArgFunction() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}
function defaultArgArrow() {
    arguments.length > 0 && void 0 !== arguments[0] && arguments[0], arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}
var C = function() {
    "use strict";
    function C() {
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : b, arguments.length > 1 && void 0 !== arguments[1] && arguments[1], _class_call_check(this, C);
    }
    return C.prototype.method = function() {
        arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : b, arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    }, C;
}(), x = function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : b, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : c, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : d;
};
function f(a) {
    var b1 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function() {
        return c;
    };
    arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : b1();
}
