function n(n) {
    return n.split(/[\\/]/);
}
var t = n("A/B\\C\\D/E\\F");
console.log(t[5], t[4], t[3], t[2], t[1], t[0], t.length);
