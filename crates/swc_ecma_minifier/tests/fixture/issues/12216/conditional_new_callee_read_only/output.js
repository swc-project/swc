function C(n) {
    this.value = n;
}
function check() {
    return true;
}
function run(C) {
    return new C(C && check() ? 1 : 2);
}
console.log(run(C).value);
