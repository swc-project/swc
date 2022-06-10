function a() {
    var a = b();
    if (a !== (a = b())) console.log("PASS");
    else console.log("FAIL");
}
function b() {
    function a() {}
    try {
        throw a;
    } catch (b) {
        return b;
    }
}
a();
