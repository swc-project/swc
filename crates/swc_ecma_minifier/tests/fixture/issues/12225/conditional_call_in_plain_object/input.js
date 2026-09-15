function run(key) {
    let x = true;

    function f(a, b) {
        return b;
    }

    return x ? f(key in { a: 0 }, 1) : f(key in { a: 0 }, 2);
}

console.log(run("a"));
