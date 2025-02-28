function n() {
    var n = e();
    if (n !== (n = e())) console.log("FAIL");
    else console.log("PASS");
}
function c() {}
function o(...n) {
    return n[0];
}
function e() {
    return o(...[
        c
    ]);
}
n();
