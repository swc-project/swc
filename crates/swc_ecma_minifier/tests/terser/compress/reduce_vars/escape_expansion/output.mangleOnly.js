function n() {
    var n = u();
    if (n !== (n = u())) console.log("FAIL");
    else console.log("PASS");
}
function o() {}
function t(...n) {
    return n[0];
}
function u() {
    return t(...[
        o
    ]);
}
n();
