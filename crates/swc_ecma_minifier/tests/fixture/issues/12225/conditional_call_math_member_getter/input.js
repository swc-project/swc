function run() {
    let x = true;

    Object.defineProperty(Math, "reviewFoo", {
        get() {
            x = false;
            return 0;
        },
    });

    function f(a, b) {
        return b;
    }

    return x ? f(Math.reviewFoo, 1) : f(Math.reviewFoo, 2);
}

console.log(run());
