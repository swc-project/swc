class C {
}
class D {
}
function F(x) {
    return 42;
}
var M;
(function(M1) {
    class A {
    }
    M1.A = A;
    function F2(x) {
        return x.toString();
    }
    M1.F2 = F2;
})(M || (M = {}));
var aNumber = 9.9;
var aString = 'this is a string';
var aDate = new Date(12);
var anObject = new Object();
var anAny = null;
var aSecondAny = undefined;
var aVoid = undefined;
var anInterface = new C();
var aClass = new C();
var aGenericClass = new D();
var anObjectLiteral = {
    id: 12
};
var anOtherObjectLiteral = new C();
var aFunction = F;
var anOtherFunction = F;
var aLambda = (x)=>2;
var aModule = M;
var aClassInModule = new M.A();
var aFunctionInModule = (x)=>'this is a string';
