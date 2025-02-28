function n() {
    var n = l.next().value;
    if (n !== (n = l.next().value)) console.log("FAIL");
    else console.log("PASS");
}
function e() {}
function* o(n) {
    for(;;)yield e;
}
var l = o();
n();
