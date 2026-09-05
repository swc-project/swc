function run() {
    let x = true;

    function f(a, b) {
        return b;
    }

    return x ? f("".trim?.(), 1) : f("".trim?.(), 2);
}

console.log(run());
