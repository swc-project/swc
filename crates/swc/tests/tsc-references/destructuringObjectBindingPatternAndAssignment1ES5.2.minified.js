//// [destructuringObjectBindingPatternAndAssignment1ES5.ts]
// In a destructuring assignment expression, the type of the expression on the right must be assignable to the assignment target on the left.
// An expression of type S is considered assignable to an assignment target V if one of the following is true
// V is an object assignment pattern and, for each assignment property P in V,
//      S is the type Any, or
(void 0).a1;
var tmp = {
    b21: "world"
};
function foo1() {
    return {
        prop1: 2
    };
}
(void 0 === tmp ? {
    b21: "string"
} : tmp).b21, foo1().prop1, foo1().prop2;
