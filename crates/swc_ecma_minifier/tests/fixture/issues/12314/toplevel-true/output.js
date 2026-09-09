if (true) {
    var o = 1;
    console.log("inside");
}
var n = 2;
function r() {
    var n = o;
    return n;
}
console.log(o, n, r());
