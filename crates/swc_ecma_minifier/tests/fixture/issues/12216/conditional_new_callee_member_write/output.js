function C(value) {
    this.value = value;
}
function run(C) {
    return C.x = 1, new C(1);
}
console.log(run(C).value);
