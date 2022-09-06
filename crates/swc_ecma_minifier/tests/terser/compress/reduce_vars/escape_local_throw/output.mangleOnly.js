function o() {
    var o = n();
    if (o !== (o = n())) console.log("PASS");
    else console.log("FAIL");
}
function n() {
    function o() {}
    try {
        throw o;
    } catch (o) {
        return o;
    }
}
o();
