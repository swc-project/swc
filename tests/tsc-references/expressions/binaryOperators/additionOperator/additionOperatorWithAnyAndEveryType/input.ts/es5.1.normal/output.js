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
function foo() {
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _classCallCheck(this, C);
    }
    _createClass(C, null, [
        {
            key: "foo",
            value: function foo() {
            }
        }
    ]);
    return C;
}();
var E1;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    E[E["c"] = 2] = "c";
})(E1 || (E1 = {
}));
var M1;
(function(M) {
    var a;
    M.a = a;
})(M1 || (M1 = {
}));
var a1;
var b;
var c;
var d;
var e;
// any as left operand, result is type Any except plusing string
var r1 = a1 + a1;
var r2 = a1 + b;
var r3 = a1 + c;
var r4 = a1 + d;
var r5 = a1 + e;
// any as right operand, result is type Any except plusing string
var r6 = b + a1;
var r7 = c + a1;
var r8 = d + a1;
var r9 = e + a1;
// other cases
var r10 = a1 + foo;
var r11 = a1 + foo();
var r12 = a1 + C;
var r13 = a1 + new C();
var r14 = a1 + E1;
var r15 = a1 + E1.a;
var r16 = a1 + M1;
var r17 = a1 + '';
var r18 = a1 + 123;
var r19 = a1 + {
    a: ''
};
var r20 = a1 + function(a) {
    return a;
};
