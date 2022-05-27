var b = 0, c = 1;
function d() {
    b = 2;
    return 4;
}
function a() {
    var a = d();
    c = b + a;
    return c;
}
console.log(a());
