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
// ! operator on any type
var ANY;
var ANY1;
var ANY2 = [
    "",
    ""
];
var obj;
var obj1 = {
    x: "",
    y: function() {
    }
};
function foo() {
    var a;
    return a;
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
                var a;
                return a;
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
// any type var
var ResultIsBoolean1 = !ANY1;
var ResultIsBoolean2 = !ANY2;
var ResultIsBoolean3 = !A;
var ResultIsBoolean4 = !M1;
var ResultIsBoolean5 = !obj;
var ResultIsBoolean6 = !obj1;
// any type literal
var ResultIsBoolean7 = !undefined;
var ResultIsBoolean8 = !null;
// any type expressions
var ResultIsBoolean9 = !ANY2[0];
var ResultIsBoolean10 = !obj1.x;
var ResultIsBoolean11 = !obj1.y;
var ResultIsBoolean12 = !objA.a;
var ResultIsBoolean13 = !M1.n;
var ResultIsBoolean14 = !foo();
var ResultIsBoolean15 = !A.foo();
var ResultIsBoolean16 = !(ANY + ANY1);
var ResultIsBoolean17 = !(null + undefined);
var ResultIsBoolean18 = !(null + null);
var ResultIsBoolean19 = !(undefined + undefined);
// multiple ! operators
var ResultIsBoolean20 = !!ANY;
var ResultIsBoolean21 = !!!(ANY + ANY1);
// miss assignment operators
!ANY;
!ANY1;
!ANY2[0];
!ANY, ANY1;
!objA.a;
!M1.n;
