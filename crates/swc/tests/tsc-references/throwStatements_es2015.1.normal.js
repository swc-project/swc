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
throw aNumber;
var aString = 'this is a string';
throw aString;
var aDate = new Date(12);
throw aDate;
var anObject = new Object();
throw anObject;
var anAny = null;
throw anAny;
var anOtherAny = new C();
throw anOtherAny;
var anUndefined = undefined;
throw anUndefined;
var aClass = new C();
throw aClass;
var aGenericClass = new D();
throw aGenericClass;
var anObjectLiteral = {
    id: 12
};
throw anObjectLiteral;
var aFunction = F;
throw aFunction;
throw aFunction('');
var aLambda = (x)=>2;
throw aLambda;
throw aLambda(1);
var aModule = M;
throw aModule;
throw typeof M;
var aClassInModule = new M.A();
throw aClassInModule;
var aFunctionInModule = M.F2;
throw aFunctionInModule;
// no initializer or annotation, so this is an 'any'
var x;
throw x;
// literals
throw 0.0;
throw false;
throw null;
throw undefined;
throw 'a string';
throw function() {
    return 'a string';
};
throw (x)=>42;
throw {
    x: 12,
    y: 13
};
throw [];
throw [
    'a',
    [
        'b'
    ]
];
throw /[a-z]/;
throw new Date();
throw new C();
throw new Object();
throw new D();
