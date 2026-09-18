if (true) {
    var o = 1;
    let e = 3;
    console.log("inside", e);
}
var e = 2;
function n() {
    var e = o;
    return e;
}
console.log(o, e, n());
