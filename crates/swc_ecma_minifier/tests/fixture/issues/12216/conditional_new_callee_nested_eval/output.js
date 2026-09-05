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
    {
        let keep;
        return swap() ? new F(1) : new F(2);
    }
}
console.log(run(A, B).value);
