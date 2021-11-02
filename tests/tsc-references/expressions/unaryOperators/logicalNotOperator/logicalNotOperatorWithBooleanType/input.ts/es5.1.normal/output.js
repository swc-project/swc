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
// ! operator on boolean type
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
var ResultIsBoolean1 = !BOOLEAN;
// boolean type literal
var ResultIsBoolean2 = !true;
var ResultIsBoolean3 = !{
    x: true,
    y: false
};
// boolean type expressions
var ResultIsBoolean4 = !objA.a;
var ResultIsBoolean5 = !M1.n;
var ResultIsBoolean6 = !foo();
var ResultIsBoolean7 = !A.foo();
// multiple ! operators
var ResultIsBoolean = !!BOOLEAN;
// miss assignment operators
!true;
!BOOLEAN;
!foo();
!true, false;
!objA.a;
!M1.n;
