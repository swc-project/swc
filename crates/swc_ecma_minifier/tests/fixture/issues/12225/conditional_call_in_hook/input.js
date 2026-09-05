function run() {
    let x = true;
    const proxy = new Proxy({}, {
        has() {
            x = false;
            return true;
        },
    });

    function f(a, b) {
        return b;
    }

    return x ? f("value" in proxy, 1) : f("value" in proxy, 2);
}

console.log(run());
