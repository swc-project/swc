class F {
    constructor(n) {
        this.value = "F" + n;
    }
}

function B(n) {
    this.value = "B" + n;
}

console.log((globalThis.eval("F = B, true") ? new F(1) : new F(2)).value);
