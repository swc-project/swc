function a() {
    var a = 3;
    return function() {
        return a;
    };
}
function b(a) {
    var b = a;
    return function() {
        return b;
    };
}
