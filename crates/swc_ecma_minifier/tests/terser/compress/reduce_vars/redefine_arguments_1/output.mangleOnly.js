function a() {
    var arguments;
    return typeof arguments;
}
function b() {
    var arguments = 42;
    return typeof arguments;
}
function c(a) {
    var arguments = a;
    return typeof arguments;
}
console.log(a(), b(), c());
