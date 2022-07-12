// @target: es5,esnext
var K;
(function(K) {
    K["a"] = "a";
    K["b"] = "b";
})(K || (K = {}));
const { [K.a]: aVal , [K.b]: bVal  } = (()=>{
    return {
        [K.a]: 1,
        [K.b]: 1
    };
})();
console.log(aVal, bVal);
