function n() {
    var n = l.next().value;
    if (n !== (n = l.next().value)) console.log("FAIL");
    else console.log("PASS");
}
function o() {}
function* e(n) {
    for (;;) yield o;
}
var l = e();
n();
