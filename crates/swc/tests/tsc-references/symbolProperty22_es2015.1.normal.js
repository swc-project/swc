//@target: ES6
foo("", {
    [Symbol.unscopables]: (s)=>s.length
});
