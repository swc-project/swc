//// [destructuringObjectBindingPatternAndAssignment7.ts]
var K = /*#__PURE__*/ function(K) {
    K["a"] = "a";
    K["b"] = "b";
    return K;
}(K || {});
const { ["a"]: aVal, ["b"]: bVal } = (()=>{
    return {
        ["a"]: 1,
        ["b"]: 1
    };
})();
console.log(aVal, bVal);
