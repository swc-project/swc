function run(value) {
    let x = 0;

    function update() {
        x = value;
        return value;
    }

    function f(a, b) {
        return a[0];
    }

    return update() ? f([x], 1) : f([x], 2);
}

console.log(run(1));
