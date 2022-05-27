var b = 0;
function c(a) {
    b = 200;
    return 100;
}
function a() {
    var a = c();
    b += a;
    return b;
}
console.log(a());
