function a() {
    var a = b();
    if (a !== (a = b())) console.log("PASS");
    else console.log("FAIL");
}
function b(a) {
    function b() {}
    function c() {}
    return a ? b : c;
}
a();
