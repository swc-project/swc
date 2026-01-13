//// [destructuringObjectBindingPatternAndAssignment7.ts]
var K = /*#__PURE__*/ function(K) {
    K["a"] = "a";
    K["b"] = "b";
    return K;
}(K || {});
const { [K.a]: aVal, [K.b]: bVal } = (()=>{
    return {
        [K.a]: 1,
        [K.b]: 1
    };
})();
console.log(aVal, bVal);
