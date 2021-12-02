var // @target: es5,esnext
K;
(function(K1) {
    K1["a"] = "a";
    K1["b"] = "b";
})(K || (K = {
}));
const { [K.a]: aVal , [K.b]: bVal  } = (()=>{
    return {
        [K.a]: 1,
        [K.b]: 1
    };
})();
console.log(aVal, bVal);
