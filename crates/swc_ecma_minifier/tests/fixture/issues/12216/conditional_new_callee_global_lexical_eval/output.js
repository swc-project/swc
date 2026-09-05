function A(n) {
    this.value = "A" + n;
}
function B(n) {
    this.value = "B" + n;
}
let F = A;
console.log((globalThis.eval("F = B, true") ? new F(1) : new F(2)).value);
