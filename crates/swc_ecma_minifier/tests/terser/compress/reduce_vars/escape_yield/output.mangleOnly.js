function n() {
    var n = o.next().value;
    if (n !== (n = o.next().value)) console.log("FAIL");
    else console.log("PASS");
}
function e() {}
function* l(n) {
    for(;;)yield e;
}
var o = l();
n();
