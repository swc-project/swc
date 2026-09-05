function run(key) {
    let x = true;
    function f(a, b) {
        return b;
    }
    return f(key in {
        a: 0
    }, x ? 1 : 2);
}
console.log(run("a"));
