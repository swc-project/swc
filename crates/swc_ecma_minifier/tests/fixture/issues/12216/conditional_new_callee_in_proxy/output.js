function A(n) {
    this.value = "A" + n;
}
function G(n) {
    this.value = "G" + n;
}
function run(F, G) {
    const proxy = new Proxy({}, {
        has () {
            F = G;
            return true;
        }
    });
    return "x" in proxy ? new F(1) : new F(2);
}
console.log(run(A, G).value);
