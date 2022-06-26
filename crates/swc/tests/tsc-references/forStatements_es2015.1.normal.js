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
for(var aNumber = 9.9;;){}
for(var aString = 'this is a string';;){}
for(var aDate = new Date(12);;){}
for(var anObject = new Object();;){}
for(var anAny = null;;){}
for(var aSecondAny = undefined;;){}
for(var aVoid = undefined;;){}
for(var anInterface = new C();;){}
for(var aClass = new C();;){}
for(var aGenericClass = new D();;){}
for(var anObjectLiteral = {
    id: 12
};;){}
for(var anOtherObjectLiteral = new C();;){}
for(var aFunction = F;;){}
for(var anOtherFunction = F;;){}
for(var aLambda = (x)=>2;;){}
for(var aModule = M;;){}
for(var aClassInModule = new M.A();;){}
for(var aFunctionInModule = (x)=>'this is a string';;){}
