function A(n) {
    this.value = "A" + n;
}

function B(n) {
    this.value = "B" + n;
}

function run(F, G) {
    const swap = () => arguments[0] = G;

    return function inner() {
        return swap() ? new F(1) : new F(2);
    };
}

console.log(run(A, B)().value);
