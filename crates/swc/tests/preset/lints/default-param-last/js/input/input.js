function f1(a = 5, b = 6, c) {}

function f2(a = 5, b, c = 5) {}

const f3 = (a = 5, b, ...c) => {};

const f4 = function f(a, b = 5, c) {};

const f5 = (a = 5, { b }) => {};

class C {
    constructor({ a } = {}, b) {}

    f([a, b] = [1, 2], c) {}
}
