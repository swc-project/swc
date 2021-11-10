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
// + operator on string type
var STRING;
var STRING1 = [
    "",
    "abc"
];
function foo() {
    return "abc";
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
                return "";
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
// string type var
var ResultIsNumber1 = +STRING;
var ResultIsNumber2 = +STRING1;
// string type literal
var ResultIsNumber3 = +"";
var ResultIsNumber4 = +{
    x: "",
    y: ""
};
var ResultIsNumber5 = +{
    x: "",
    y: function(s) {
        return s;
    }
};
// string type expressions
var ResultIsNumber6 = +objA.a;
var ResultIsNumber7 = +M1.n;
var ResultIsNumber8 = +STRING1[0];
var ResultIsNumber9 = +foo();
var ResultIsNumber10 = +A.foo();
var ResultIsNumber11 = +(STRING + STRING);
var ResultIsNumber12 = +STRING.charAt(0);
// miss assignment operators
+"";
+STRING;
+STRING1;
+foo();
+objA.a, M1.n;
