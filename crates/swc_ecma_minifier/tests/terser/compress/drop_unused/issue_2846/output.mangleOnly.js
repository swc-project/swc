function a(a, b) {
    var a = 0;
    b && b(a);
    return a++;
}
var b = a();
console.log(b);
