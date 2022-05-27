function a(a) {
    var b = a;
    return a + b;
}
function b(a) {
    var b = a;
    return a++ + b;
}
function c(a) {
    var b = a++;
    return a + b;
}
function d(a) {
    var b = a++;
    return a++ + b;
}
function e(a) {
    var b = (function() {
        return a;
    })();
    return a++ + b;
}
console.log(a(1), b(1), c(1), d(1), e(1));
