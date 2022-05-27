function b(a) {
    return a.split(/[\\/]/);
}
var a = b("A/B\\C\\D/E\\F");
console.log(a[5], a[4], a[3], a[2], a[1], a[0], a.length);
