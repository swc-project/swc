function foo(data) {
    const mutable = [];
    function f(x) {
        mutable.push(x);
        return x + 1;
    }
    const processed = data.map((x)=>f(x));
    return {
        mutable: [
            ...mutable
        ],
        processed
    };
}
console.log(foo([
    1,
    2,
    3
]));
