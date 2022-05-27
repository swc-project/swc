function a() {
    return a;
    var a;
}
function b() {
    return a;
    var a = 1;
}
console.log(a(), b());
