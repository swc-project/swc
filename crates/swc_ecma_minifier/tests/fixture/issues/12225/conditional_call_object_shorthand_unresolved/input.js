function run() {
    let x = true;

    Object.defineProperty(globalThis, "evil", {
        get() {
            x = false;
            return 0;
        },
    });

    function f(a, b) {
        return b;
    }

    return x ? f({ evil }, 1) : f({ evil }, 2);
}

console.log(run());
