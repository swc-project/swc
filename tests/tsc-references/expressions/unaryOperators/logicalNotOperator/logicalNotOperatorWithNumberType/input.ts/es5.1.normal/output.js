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
// ! operator on number type
var NUMBER;
var NUMBER1 = [
    1,
    2
];
function foo() {
    return 1;
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
                return 1;
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
// number type var
var ResultIsBoolean1 = !NUMBER;
var ResultIsBoolean2 = !NUMBER1;
// number type literal
var ResultIsBoolean3 = !1;
var ResultIsBoolean4 = !{
    x: 1,
    y: 2
};
var ResultIsBoolean5 = !{
    x: 1,
    y: function(n) {
        return n;
    }
};
// number type expressions
var ResultIsBoolean6 = !objA.a;
var ResultIsBoolean7 = !M1.n;
var ResultIsBoolean8 = !NUMBER1[0];
var ResultIsBoolean9 = !foo();
var ResultIsBoolean10 = !A.foo();
var ResultIsBoolean11 = !(NUMBER + NUMBER);
// multiple ! operator
var ResultIsBoolean12 = !!NUMBER;
var ResultIsBoolean13 = !!!(NUMBER + NUMBER);
// miss assignment operators
!1;
!NUMBER;
!NUMBER1;
!foo();
!objA.a;
!M1.n;
!objA.a, M1.n;
