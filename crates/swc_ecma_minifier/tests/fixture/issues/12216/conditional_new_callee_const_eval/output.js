function A(value) {
    this.value = "A" + value;
}
function check() {
    eval("");
    return true;
}
function run() {
    const F = A;
    return new F(check() ? 1 : 2);
}
console.log(run().value);
