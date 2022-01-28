function f(s) {
    return s.split(/[\\/]/);
}
var r = f("A/B\\C\\D/E\\F");
console.log(r[5], r[4], r[3], r[2], r[1], r[0], r.length);
