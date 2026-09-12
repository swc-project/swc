function run() {
    let x = true;
    const proxy = new Proxy({}, {
        get() {
            x = false;
        },
    });

    function f(a, b) {
        return b;
    }

    return x
        ? f(class { accessor [proxy.key]; }, 1)
        : f(class { accessor [proxy.key]; }, 2);
}

console.log(run());
