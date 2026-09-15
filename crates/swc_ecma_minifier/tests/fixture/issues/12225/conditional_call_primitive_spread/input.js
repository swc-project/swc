function run() {
    let x = true;
    const iterable = {
        [Symbol.iterator]() {
            x = false;
            return [][Symbol.iterator]();
        },
    };

    function f(a, b) {
        return b;
    }

    return x ? f("".concat(...iterable), 1) : f("".concat(...iterable), 2);
}

console.log(run());
