function a() {
    var a = b();
    if (a !== (a = b())) console.log("FAIL");
    else console.log("PASS");
}
function b() {
    try {
        throw c;
    } catch (a) {
        return a;
    }
}
function c() {}
a();
