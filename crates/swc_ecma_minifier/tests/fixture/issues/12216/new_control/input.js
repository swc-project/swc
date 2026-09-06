function A(n) {
    this.value = "A" + n;
}

function run(F, test) {
    return test ? new F(1) : new F(2);
}

console.log(run(A, true).value);
