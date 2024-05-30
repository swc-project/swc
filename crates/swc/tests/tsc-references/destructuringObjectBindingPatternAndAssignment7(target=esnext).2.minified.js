//// [destructuringObjectBindingPatternAndAssignment7.ts]
var K;
(K = {}).a = "a", K.b = "b";
const { a: aVal, b: bVal } = {
    a: 1,
    b: 1
};
console.log(aVal, bVal);
