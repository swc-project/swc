function a() {
    var a = b();
    if (a !== (a = b())) console.log("FAIL");
    else console.log("PASS");
}
function b(a) {
    return a ? c : d;
}
function c() {}
function d() {}
a();
