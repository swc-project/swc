function o() {
    var o = n();
    if (o !== (o = n())) console.log("FAIL");
    else console.log("PASS");
}
function n() {
    try {
        throw c;
    } catch (o) {
        return o;
    }
}
function c() {}
o();
