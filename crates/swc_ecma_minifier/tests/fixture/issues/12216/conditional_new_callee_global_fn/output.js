function A(n) {
    this.value = "A" + n;
}
function B(n) {
    this.value = "B" + n;
}
function F(n) {
    this.value = "F" + n;
}
console.log(((globalThis.F = B) ? new F(1) : new F(2)).value);
