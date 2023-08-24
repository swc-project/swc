//// [destructuringVariableDeclaration2.ts]
// The type T associated with a destructuring variable declaration is determined as follows:
//      If the declaration includes a type annotation, T is that type.
var _ref // Error
 = {
    a1: !0,
    a2: 1
};
_ref.a1, _ref.a2;
// The type T associated with a binding element is determined as follows:
//      If the binding element is a rest element, T is an array type with
//          an element type E, where E is the type of the numeric index signature of S.
var _ref1 = [
    1,
    2,
    {
        c3: 4,
        c5: 0
    }
], _ref_ = (_ref1[0], _ref1[1], _ref1[2]); // Error
_ref_.c3, _ref_.c5, _ref1.slice(4);
 // Error
