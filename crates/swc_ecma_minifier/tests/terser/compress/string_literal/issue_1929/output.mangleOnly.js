function l(n) {
    return n.split(/[\\/]/);
}
var n = l("A/B\\C\\D/E\\F");
console.log(n[5], n[4], n[3], n[2], n[1], n[0], n.length);
