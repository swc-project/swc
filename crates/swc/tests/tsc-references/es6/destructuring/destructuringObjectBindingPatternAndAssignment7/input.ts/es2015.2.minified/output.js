var K, K1;
(K1 = K || (K = {
})).a = "a", K1.b = "b";
const { [K.a]: aVal , [K.b]: bVal  } = {
    [K.a]: 1,
    [K.b]: 1
};
console.log(aVal, bVal);
