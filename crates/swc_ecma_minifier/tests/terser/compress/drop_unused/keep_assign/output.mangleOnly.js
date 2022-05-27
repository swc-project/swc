function a() {
    var a;
    a = 1;
}
function b() {
    var a = 1;
    a = 2;
}
function c(a) {
    a = 1;
}
function d() {
    var a;
    return (a = 1);
}
function e() {
    var a;
    return function() {
        a = 1;
    };
}
