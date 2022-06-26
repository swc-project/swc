function a(a) {
    return a.split(/[\\/]/);
}
var b = a("A/B\\C\\D/E\\F");
console.log(b[5], b[4], b[3], b[2], b[1], b[0], b.length);
