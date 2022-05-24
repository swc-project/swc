import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @allowUnreachableCode: true
// ~ operator on string type
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
        _class_call_check(this, A);
    }
    A.foo = function foo() {
        return "";
    };
    return A;
}();
var M;
(function(M1) {
    var n;
    M1.n = n;
})(M || (M = {}));
var objA = new A();
// string type var
var ResultIsNumber1 = ~STRING;
var ResultIsNumber2 = ~STRING1;
// string type literal
var ResultIsNumber3 = ~"";
var ResultIsNumber4 = ~{
    x: "",
    y: ""
};
var ResultIsNumber5 = ~{
    x: "",
    y: function(s) {
        return s;
    }
};
// string type expressions
var ResultIsNumber6 = ~objA.a;
var ResultIsNumber7 = ~M.n;
var ResultIsNumber8 = ~STRING1[0];
var ResultIsNumber9 = ~foo();
var ResultIsNumber10 = ~A.foo();
var ResultIsNumber11 = ~(STRING + STRING);
var ResultIsNumber12 = ~STRING.charAt(0);
// multiple ~ operators
var ResultIsNumber13 = ~~STRING;
var ResultIsNumber14 = ~~~(STRING + STRING);
//miss assignment operators
~STRING;
~STRING1;
~foo();
~objA.a, M.n;
