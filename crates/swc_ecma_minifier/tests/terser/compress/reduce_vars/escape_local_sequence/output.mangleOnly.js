function a() {
    var a = b();
    if (a !== (a = b())) console.log("PASS");
    else console.log("FAIL");
}
function b() {
    function a() {}
    function b() {}
    return a, b;
}
a();
