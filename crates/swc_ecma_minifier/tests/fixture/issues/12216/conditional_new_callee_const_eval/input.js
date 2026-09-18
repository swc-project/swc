function A(value) {
    this.value = "A" + value;
}

function check() {
    eval("");
    return true;
}

function run() {
    const F = A;
    return check() ? new F(1) : new F(2);
}

console.log(run().value);
