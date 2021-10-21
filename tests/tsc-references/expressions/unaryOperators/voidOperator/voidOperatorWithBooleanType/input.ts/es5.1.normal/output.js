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
// void  operator on boolean type
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
                return false;
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
var ResultIsAny1 = void BOOLEAN;
// boolean type literal
var ResultIsAny2 = void true;
var ResultIsAny3 = void {
    x: true,
    y: false
};
// boolean type expressions
var ResultIsAny4 = void objA.a;
var ResultIsAny5 = void M1.n;
var ResultIsAny6 = void foo();
var ResultIsAny7 = void A.foo();
// multiple void  operator
var ResultIsAny8 = void void BOOLEAN;
// miss assignment operators
void true;
void BOOLEAN;
void foo();
true, false;
void objA.a;
void M1.n;
