function A(n) {
    this.value = "A" + n;
}
function B(n) {
    this.value = "B" + n;
}
for(let i = 0; i < 1; i++)var F = A;
console.log(((globalThis.F = B) ? new F(1) : new F(2)).value);
