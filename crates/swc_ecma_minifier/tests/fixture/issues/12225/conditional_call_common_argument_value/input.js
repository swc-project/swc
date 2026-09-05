function run() {
    let x = 0;

    function f(a, b) {
        return a[0];
    }

    return (x = 1) ? f([x], 1) : f([x], 2);
}

console.log(run());
