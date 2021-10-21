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
// ++ operator on string type
var STRING;
var STRING1 = [
    "",
    ""
];
function foo() {
    return "";
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
var ResultIsNumber1 = ++STRING;
var ResultIsNumber2 = ++STRING1;
var ResultIsNumber3 = STRING++;
var ResultIsNumber4 = STRING1++;
// string type literal
var ResultIsNumber5 = ++"";
var ResultIsNumber6 = ++{
    x: "",
    y: ""
};
var ResultIsNumber7 = ++{
    x: "",
    y: function(s) {
        return s;
    }
};
var ResultIsNumber8 = ""++;
var ResultIsNumber9 = {
    x: "",
    y: ""
}++;
var ResultIsNumber10 = {
    x: "",
    y: function(s) {
        return s;
    }
}++;
// string type expressions
var ResultIsNumber11 = ++objA.a;
var ResultIsNumber12 = ++M1.n;
var ResultIsNumber13 = ++STRING1[0];
var ResultIsNumber14 = ++foo();
var ResultIsNumber15 = ++A.foo();
var ResultIsNumber16 = ++STRING + STRING;
var ResultIsNumber17 = objA.a++;
var ResultIsNumber18 = M1.n++;
var ResultIsNumber19 = STRING1[0]++;
var ResultIsNumber20 = foo()++;
var ResultIsNumber21 = A.foo()++;
var ResultIsNumber22 = STRING + STRING++;
// miss assignment operators
++"";
++STRING;
++STRING1;
++STRING1[0];
++foo();
++objA.a;
++M1.n;
++objA.a, M1.n;
""++;
STRING++;
STRING1++;
STRING1[0]++;
foo()++;
objA.a++;
M1.n++;
objA.a++, M1.n++;
