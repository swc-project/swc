var K, K;
(K = K || (K = {})).a = "a", K.b = "b";
const { [K.a]: aVal , [K.b]: bVal  } = {
    [K.a]: 1,
    [K.b]: 1
};
console.log(aVal, bVal);
