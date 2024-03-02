//// [destructuringObjectBindingPatternAndAssignment7.ts]
var K, K1;
(K1 = K || (K = {})).a = "a", K1.b = "b";
const { a: aVal, b: bVal } = {
    a: 1,
    b: 1
};
console.log(aVal, bVal);
