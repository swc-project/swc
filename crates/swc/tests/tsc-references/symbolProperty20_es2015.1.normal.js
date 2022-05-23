var i = {
    [Symbol.iterator]: (s)=>s,
    [Symbol.toStringTag] (n) {
        return n;
    }
};
