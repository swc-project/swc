class C {
}
class D {
}
function F(x) {
    return 42;
}
function F2(x) {
    return x < 42;
}
var M;
(function(M1) {
    class A {
    }
    M1.A = A;
    function F21(x) {
        return x.toString();
    }
    M1.F2 = F21;
})(M || (M = {}));
var N;
(function(N1) {
    class A {
    }
    N1.A = A;
    function F22(x) {
        return x.toString();
    }
    N1.F2 = F22;
})(N || (N = {}));
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
var aFunction = F2;
var anOtherFunction = F2;
var aLambda = (x)=>'a string';
var aModule = N;
var aClassInModule = new N.A();
var aFunctionInModule = F2;
