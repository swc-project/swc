//// [symbolProperty22.ts]
foo("", {
    [Symbol.unscopables]: (s)=>s.length
});
