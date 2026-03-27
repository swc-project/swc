function outer() {
    let f = (a)=>a;
    eval("f = (_, b) => b");
    function inner() {
        return f(1, 2);
    }
    return inner();
}
console.log(outer());
