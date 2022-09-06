function n() {
    var n = o();
    if (n !== (n = o())) console.log("FAIL");
    else console.log("PASS");
}
function o(n) {
    return n ? c : e;
}
function c() {}
function e() {}
n();
