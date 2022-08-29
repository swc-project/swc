//// [destructuringVariableDeclaration2.ts]
// The type T associated with a destructuring variable declaration is determined as follows:
//      If the declaration includes a type annotation, T is that type.
var ref // Error
 = {
    a1: true,
    a2: 1
}, a1 = ref.a1, a2 = ref.a2;
var a3 = 1, a4 = false, a5 = true; // Error
// The type T associated with a destructuring variable declaration is determined as follows:
//      Otherwise, if the declaration includes an initializer expression, T is the type of that initializer expression.
var temp = {
    t1: true,
    t2: "false"
};
var tmp = 3, b0 = tmp === void 0 ? 3 : tmp, tmp1 = false, b1 = tmp1 === void 0 ? true : tmp1, tmp2 = {
    t1: false,
    t2: 5
}, b2 = tmp2 === void 0 ? temp : tmp2; // Error
// The type T associated with a binding element is determined as follows:
//      If the binding element is a rest element, T is an array type with
//          an element type E, where E is the type of the numeric index signature of S.
var ref1 = [
    1,
    2,
    {
        c3: 4,
        c5: 0
    }
], c1 = ref1[0], c2 = ref1[1], ref2 = ref1[2], c4 = ref2.c3, c5 = ref2.c5, c6 = ref1.slice(4); // Error
// When a destructuring variable declaration, binding property, or binding element specifies
// an initializer expression, the type of the initializer expression is required to be assignable
// to the widened form of the type associated with the destructuring variable declaration, binding property, or binding element.
var ref3 = {
    d: {
        d1: [
            1,
            2
        ]
    }
}, _d = ref3.d, _d1 = _d.d1, d1 = _d1 === void 0 ? [
    "string",
    null
] : _d1; // Error
