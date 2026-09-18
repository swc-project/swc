function A(n) {
    this.value = "A" + n;
}

function B(n) {
    this.value = "B" + n;
}

function run(F, G, selector) {
    const swap = () => arguments[0] = G;

    switch (selector) {
        case 0:
            return swap() ? new F(1) : new F(2);
    }
}

console.log(run(A, B, 0).value);
