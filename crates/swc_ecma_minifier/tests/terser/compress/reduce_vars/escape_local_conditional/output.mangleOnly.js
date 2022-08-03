function n() {
    var n = o();
    if (n !== (n = o())) console.log("PASS");
    else console.log("FAIL");
}
function o(n) {
    function o() {}
    function f() {}
    return n ? o : f;
}
n();
