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

    return x
        ? f(new (class {})(...iterable), 1)
        : f(new (class {})(...iterable), 2);
}

console.log(run());
