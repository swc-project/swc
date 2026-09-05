function A(n) {
    this.value = "A" + n;
}
function B(n) {
    this.value = "B" + n;
}
var F = A;
var box = {
    F: A
};
with (box)console.log(((box.F = B) ? new F(1) : new F(2)).value);
