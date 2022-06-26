class C {
}
class D {
}
function F(x) {
    return 42;
}
var M;
(function(M) {
    class A {
    }
    M.A = A;
    function F2(x) {
        return x.toString();
    }
    M.F2 = F2;
})(M || (M = {}));
var aNumber = 9.9;
var aString = 'this is a string';
var aDate = new Date(12);
var anObject = new Object();
var anAny = null;
var anOtherAny = new C();
var anUndefined = undefined;
var aClass = new C();
var aGenericClass = new D();
var anObjectLiteral = {
    id: 12
};
var aFunction = F;
var aLambda = (x)=>2;
var aModule = M;
var aClassInModule = new M.A();
var aFunctionInModule = M.F2;
// no initializer or annotation, so this is an 'any'
var x;
