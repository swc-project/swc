//// [destructuringObjectBindingPatternAndAssignment7.ts]
var K, K1 = ((K = K1 || {}).a = "a", K.b = "b", K);
let { [K1.a]: aVal, [K1.b]: bVal } = {
    [K1.a]: 1,
    [K1.b]: 1
};
console.log(aVal, bVal);
