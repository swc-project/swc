function a() {
    var a = d();
    if (a !== (a = d())) console.log("FAIL");
    else console.log("PASS");
}
function b() {}
function c(...a) {
    return a[0];
}
function d() {
    return c(...[
        b
    ]);
}
a();
