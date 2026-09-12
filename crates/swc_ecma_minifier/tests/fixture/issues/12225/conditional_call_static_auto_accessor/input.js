function run() {
    let x = true;

    function f(a, b) {
        return b;
    }

    return x
        ? f(class { static accessor value = (x = false); }, 1)
        : f(class { static accessor value = (x = false); }, 2);
}

console.log(run());
