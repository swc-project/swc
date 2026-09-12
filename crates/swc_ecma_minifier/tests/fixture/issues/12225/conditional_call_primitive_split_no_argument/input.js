function run() {
    let x = true;

    function f(a, b) {
        return b;
    }

    return x ? f("".split(), 1) : f("".split(), 2);
}

console.log(run());
