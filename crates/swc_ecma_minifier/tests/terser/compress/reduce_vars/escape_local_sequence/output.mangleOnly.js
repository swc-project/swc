function n() {
    var n = o();
    if (n !== (n = o())) console.log("PASS");
    else console.log("FAIL");
}
function o() {
    function n() {}
    function o() {}
    return n, o;
}
n();
