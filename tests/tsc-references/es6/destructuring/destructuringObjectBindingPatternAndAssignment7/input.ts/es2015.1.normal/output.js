var // @target: es5,esnext
K1;
(function(K) {
    K["a"] = "a";
    K["b"] = "b";
})(K1 || (K1 = {
}));
const { [K1.a]: aVal , [K1.b]: bVal  } = (()=>{
    return {
        [K1.a]: 1,
        [K1.b]: 1
    };
})();
console.log(aVal, bVal);
