function f0() {
    var a = [1, 2, 3];
    var b = 0;
    for (var i = 0; i < 3; i++) b += a[i];
    return b;
}
function f1() {
    var a = [1, 2, 3];
    var b = 0;
    for (var i = 0; i < 3; i++) b += a[i];
    return b;
}
function f2() {
    var a = [1, 2, 3];
    for (var i = 0; i < a.length; i++) a[i]++;
    return a[2];
}
console.log(f0(), f1(), f2());
