//// [destructuringObjectBindingPatternAndAssignment7.ts]
var K, K1 = ((K = K1 || {}).a = "a", K.b = "b", K);
const { a: aVal, b: bVal } = {
    a: 1,
    b: 1
};
console.log(aVal, bVal);
