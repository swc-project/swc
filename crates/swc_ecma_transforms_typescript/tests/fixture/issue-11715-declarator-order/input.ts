const first = 1, second = (()=>{
    enum Nested {
        A = first,
        B
    }
    return Nested;
})();
