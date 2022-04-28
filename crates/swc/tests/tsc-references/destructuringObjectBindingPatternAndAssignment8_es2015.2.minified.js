const K = {
    a: "a",
    b: "b"
}, { [K.a]: aVal , [K.b]: bVal  } = {
    [K.a]: 1,
    [K.b]: 1
};
console.log(aVal, bVal);
