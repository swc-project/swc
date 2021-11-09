class C {
}
class D {
}
function F(x) {
    return 42;
}
function F21(x) {
    return x < 42;
}
var M1;
(function(M) {
    class A {
    }
    M.A = A;
    function F2(x) {
        return x.toString();
    }
    M.F2 = F2;
})(M1 || (M1 = {
}));
var N1;
(function(N) {
    class A {
    }
    N.A = A;
    function F2(x) {
        return x.toString();
    }
    N.F2 = F2;
})(N1 || (N1 = {
}));
var aNumber = 'this is a string';
var aString = 9.9;
var aDate = 9.9;
var aVoid = 9.9;
var anInterface = new D();
var aClass = new D();
var aGenericClass = new C();
var anObjectLiteral = {
    id: 'a string'
};
var anOtherObjectLiteral = new C();
var aFunction = F21;
var anOtherFunction = F21;
var aLambda = (x)=>'a string'
;
var aModule = N1;
var aClassInModule = new N1.A();
var aFunctionInModule = F21;
