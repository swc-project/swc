//// [destructuringObjectBindingPatternAndAssignment1ES5.ts]
(void 0).a1;
var tmp = {};
function foo1() {
    return {
        prop1: 2
    };
}
(void 0 === tmp ? {
    b21: "string"
} : tmp).b21, foo1().prop1, foo1().prop2;
