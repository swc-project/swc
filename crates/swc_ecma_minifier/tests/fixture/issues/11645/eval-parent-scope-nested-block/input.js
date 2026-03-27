function outer() {
    let f = (a) => a;

    eval("f = (_, b) => b");

    {
        return f(1, 2);
    }
}

console.log(outer());
