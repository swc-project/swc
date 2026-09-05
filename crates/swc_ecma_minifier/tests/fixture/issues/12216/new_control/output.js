function A(n) {
    this.value = "A" + n;
}
function run(F, test) {
    return new F(test ? 1 : 2);
}
console.log(run(A, true).value);
