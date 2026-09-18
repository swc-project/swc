function run() {
    let x = true;

    function f(a, b) {
        return b;
    }

    return x ? f(0, 1) : f(0, 2);
}

console.log(run());
