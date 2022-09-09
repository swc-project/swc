function n(n) {
    return n.split(/[\\/]/);
}
var l = n("A/B\\C\\D/E\\F");
console.log(l[5], l[4], l[3], l[2], l[1], l[0], l.length);
