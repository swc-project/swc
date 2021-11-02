// + operator on string type
var STRING;
var STRING1 = [
    "",
    "abc"
];
function foo() {
    return "abc";
}
class A {
    static foo() {
        return "";
    }
}
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
    y: (s)=>{
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
