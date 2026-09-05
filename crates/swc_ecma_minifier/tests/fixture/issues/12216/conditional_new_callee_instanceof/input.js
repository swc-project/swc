function A(n) {
    this.value = "A" + n;
}

function G(n) {
    this.value = "G" + n;
}

function run(F, G) {
    const checker = {
        [Symbol.hasInstance]() {
            F = G;
            return true;
        },
    };

    return ({}) instanceof checker ? new F(1) : new F(2);
}

console.log(run(A, G).value);
