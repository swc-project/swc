class SomeBase {
}
class SomeDerived1 extends SomeBase {
}
class SomeDerived2 extends SomeBase {
}
class SomeDerived3 extends SomeBase {
}
// Ambiguous call picks the first overload in declaration order
class fn1 {
    constructor(){}
}
new fn1(undefined);
// No candidate overloads found
new fn1({}); // Error
// Generic and non - generic overload where generic overload is the only candidate when called with type arguments
class fn2 {
    constructor(){}
}
var d = new fn2(0, undefined);
// Generic and non - generic overload where generic overload is the only candidate when called without type arguments
var s = new fn2(0, '');
// Generic and non - generic overload where non - generic overload is the only candidate when called with type arguments
new fn2('', 0); // OK
// Generic and non - generic overload where non - generic overload is the only candidate when called without type arguments
new fn2('', 0); // OK
// Generic overloads with differing arity called without type arguments
class fn3 {
    constructor(){}
}
new fn3(3);
new fn3('', 3, '');
new fn3(5, 5, 5);
// Generic overloads with differing arity called with type arguments matching each overload type parameter count
new fn3(4); // Error
new fn3('', '', ''); // Error
new fn3('', '', 3);
// Generic overloads with differing arity called with type argument count that doesn't match any overload
new fn3(); // Error
// Generic overloads with constraints called with type arguments that satisfy the constraints
class fn4 {
    constructor(){}
}
new fn4('', 3);
new fn4(3, ''); // Error
new fn4('', 3); // Error
new fn4(3, ''); // Error
// Generic overloads with constraints called without type arguments but with types that satisfy the constraints
new fn4('', 3);
new fn4(3, ''); // Error
new fn4(3, undefined); // Error
new fn4('', null);
// Generic overloads with constraints called with type arguments that do not satisfy the constraints
new fn4(null, null); // Error
// Generic overloads with constraints called without type arguments but with types that do not satisfy the constraints
new fn4(true, null); // Error
new fn4(null, true); // Error
// Non - generic overloads where contextual typing of function arguments has errors
class fn5 {
    constructor(){
        return undefined;
    }
}
new fn5((n)=>n.toFixed());
new fn5((n)=>n.substr(0));
new fn5((n)=>n.blah); // Error
