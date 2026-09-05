function run(value) {
    let x = 0;

    function update() {
        x = value;
        return value;
    }

    function f(a, b) {
        return b;
    }

    return update()
        ? f(class { value = x }, 1)
        : f(class { value = x }, 2);
}

console.log(run(1));
