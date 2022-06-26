var // When a function expression with no type parameters and no parameter type annotations 
// is contextually typed (section 4.19) by a type T and a contextual signature S can be extracted from T
E;
(function(E) {
    E[E["red"] = 0] = "red";
    E[E["blue"] = 1] = "blue";
})(E || (E = {}));
// A contextual signature S is extracted from a function type T as follows:
//      If T is a function type with exactly one call signature, and if that call signature is non- generic, S is that signature.
var a0 = (num, str)=>{
    num.toExponential();
    return 0;
};
class Class {
    foo() {}
}
var a1 = (a1)=>{
    a1.foo();
    return 1;
};
// A contextual signature S is extracted from a function type T as follows:
//      If T is a union type, let U be the set of element types in T that have call signatures.
//        If each type in U has exactly one call signature and that call signature is non- generic,
//        and if all of the signatures are identical ignoring return types,
//        then S is a signature with the same parameters and a union of the return types.
var b1;
b1 = (k, h)=>{};
var b2;
b2 = (foo, bar)=>{
    return foo + 1;
};
b2 = (foo, bar)=>{
    return "hello";
};
var b3;
b3 = (name, number)=>{};
var b4 = (number = 1)=>{
    return "hello";
};
var b5 = (number = "string")=>{
    return "hello";
};
// A contextual signature S is extracted from a function type T as follows:
//      Otherwise, no contextual signature can be extracted from T and S is undefined.
var b6;
var b7;
b6 = (k)=>{
    k.toLowerCase();
};
b6 = (i)=>{
    i.toExponential();
    return i;
}; // Per spec, no contextual signature can be extracted in this case. (Otherwise clause)
b7 = (j, m)=>{}; // Per spec, no contextual signature can be extracted in this case. (Otherwise clause)
class C {
    constructor(){
        var k = (j, k)=>{
            return [
                j,
                k
            ];
        } // Per spec, no contextual signature can be extracted in this case.
        ;
    }
}
