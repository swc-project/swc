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
// -- operator on boolean type
var BOOLEAN;
function foo() {
    return true;
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _classCallCheck(this, A);
    }
    _createClass(A, null, [
        {
            key: "foo",
            value: function foo() {
                return true;
            }
        }
    ]);
    return A;
}();
var M1;
(function(M) {
    var n;
    M.n = n;
})(M1 || (M1 = {
}));
var objA = new A();
// boolean type var
var ResultIsNumber1 = --BOOLEAN;
var ResultIsNumber2 = BOOLEAN--;
// boolean type literal
var ResultIsNumber3 = --true;
var ResultIsNumber4 = --{
    x: true,
    y: false
};
var ResultIsNumber5 = --{
    x: true,
    y: function(n) {
        return n;
    }
};
var ResultIsNumber6 = true--;
var ResultIsNumber7 = {
    x: true,
    y: false
}--;
var ResultIsNumber8 = {
    x: true,
    y: function(n) {
        return n;
    }
}--;
// boolean type expressions
var ResultIsNumber9 = --objA.a;
var ResultIsNumber10 = --M1.n;
var ResultIsNumber11 = --foo();
var ResultIsNumber12 = --A.foo();
var ResultIsNumber13 = foo()--;
var ResultIsNumber14 = A.foo()--;
var ResultIsNumber15 = objA.a--;
var ResultIsNumber16 = M1.n--;
// miss assignment operators
--true;
--BOOLEAN;
--foo();
--objA.a;
--M1.n;
--objA.a, M1.n;
true--;
BOOLEAN--;
foo()--;
objA.a--;
M1.n--;
objA.a--, M1.n--;
