//// [destructuringObjectBindingPatternAndAssignment6.ts]
const a = "a", b = "b", { a: aVal , b: bVal  } = {
    a: 1,
    b: 1
};
console.log(aVal, bVal);
