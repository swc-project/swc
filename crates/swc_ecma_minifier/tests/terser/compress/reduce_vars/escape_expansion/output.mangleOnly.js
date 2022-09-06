function n() {
    var n = e();
    if (n !== (n = e())) console.log("FAIL");
    else console.log("PASS");
}
function o() {}
function c(...n) {
    return n[0];
}
function e() {
    return c(...[o]);
}
n();
