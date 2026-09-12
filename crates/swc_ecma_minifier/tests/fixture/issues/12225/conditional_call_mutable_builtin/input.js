function run() {
    let x = true;

    Object.defineProperty(globalThis, "Object", {
        get() {
            x = false;
            return 0;
        },
    });

    function f(a, b) {
        return b;
    }

    return x ? f(Object, 1) : f(Object, 2);
}

console.log(run());
