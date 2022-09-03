//// [symbolProperty20.ts]
var i = {
    [Symbol.iterator]: (s)=>s,
    [Symbol.toStringTag]: (n)=>n
};
