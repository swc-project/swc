function n() {
    var n = o();
    if (n !== (n = o())) console.log("FAIL");
    else console.log("PASS");
}
function o(n) {
    return n ? f : i;
}
function f() {}
function i() {}
n();
