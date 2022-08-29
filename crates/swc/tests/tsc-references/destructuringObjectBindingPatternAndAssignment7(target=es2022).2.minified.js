//// [destructuringObjectBindingPatternAndAssignment7.ts]
var K;
!function(K) {
    K.a = "a", K.b = "b";
}(K || (K = {}));
const { [K.a]: aVal , [K.b]: bVal  } = {
    [K.a]: 1,
    [K.b]: 1
};
console.log(aVal, bVal);
