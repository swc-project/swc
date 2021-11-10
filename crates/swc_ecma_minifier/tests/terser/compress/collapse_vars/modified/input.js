function f1(b) {
    var a = b;
    return b + a;
}
function f2(b) {
    var a = b;
    return b++ + a;
}
function f3(b) {
    var a = b++;
    return b + a;
}
function f4(b) {
    var a = b++;
    return b++ + a;
}
function f5(b) {
    var a = (function () {
        return b;
    })();
    return b++ + a;
}
console.log(f1(1), f2(1), f3(1), f4(1), f5(1));
