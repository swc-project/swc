function run() {
    let x = true;

    function f(a, b) {
        return b;
    }

    return x ? f(class extends null {}, 1) : f(class extends null {}, 2);
}

console.log(run());
