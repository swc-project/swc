function run() {
    let x = true;
    const separator = {
        [Symbol.split]() {
            x = false;
            return [];
        },
    };

    function f(a, b) {
        return b;
    }

    return x ? f("".split(separator), 1) : f("".split(separator), 2);
}

console.log(run());
