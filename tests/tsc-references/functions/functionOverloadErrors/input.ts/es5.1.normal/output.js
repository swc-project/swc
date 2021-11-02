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
function fn1() {
}
function fn2a() {
}
function fn2b() {
}
function fn3() {
    return null;
}
function fn6() {
}
function fn7() {
}
function fn8() {
}
function fn9() {
}
function fn10() {
}
function fn11() {
}
function fn12() {
}
var cls = //Function overloads that differ by accessibility
/*#__PURE__*/ function() {
    "use strict";
    function cls() {
        _classCallCheck(this, cls);
    }
    _createClass(cls, [
        {
            key: "f",
            value: function f() {
            }
        },
        {
            key: "g",
            value: function g() {
            }
        }
    ]);
    return cls;
}();
//Function overloads with differing export
var M1;
(function(M) {
    var fn1 = function fn1() {
    };
    var fn2 = function fn2() {
    };
    M.fn2 = fn2;
})(M1 || (M1 = {
}));
function dfn1() {
}
function dfn2() {
}
function fewerParams(n) {
}
function fn13(n) {
}
function fn14() {
    return 3;
}
function fn15() {
    return undefined;
}
function initExpr() {
}
