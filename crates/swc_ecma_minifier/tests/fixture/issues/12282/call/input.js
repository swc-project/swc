function foo(data) {
    const mutable = [];

    function f(x) {
        mutable.push(x);
        return x + 1;
    }

    const processed = data.map((x) => f(x));

    return Array.of(...mutable, processed);
}

class Pair {
    constructor(...values) {
        this.values = values;
    }
}

function bar(data) {
    const mutable = [];

    function f(x) {
        mutable.push(x);
        return x + 1;
    }

    const processed = data.map((x) => f(x));

    return new Pair(...mutable, processed).values;
}

console.log(foo([1, 2, 3]));
console.log(bar([1, 2, 3]));
