function run(value) {
    let x = 0;

    function update() {
        x = value;
        return value;
    }

    function f(a, b) {
        return a.value;
    }

    return update()
        ? f(new (class { accessor value = x; })(), 1)
        : f(new (class { accessor value = x; })(), 2);
}

console.log(run(1));
