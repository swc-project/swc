function A(n) {
    this.value = "A" + n;
}
function B(n) {
    this.value = "B" + n;
}
function run(F, G) {
    function swap() {
        eval("F = G");
        return true;
    }
    return function inner() {
        return swap() ? new F(1) : new F(2);
    };
}
console.log(run(A, B)().value);
