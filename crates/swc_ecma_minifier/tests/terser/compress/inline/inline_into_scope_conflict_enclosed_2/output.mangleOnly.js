global.same_name = ()=>console.log("PASS");
function a(a) {
    console.log(a === undefined ? "PASS" : "FAIL");
    b();
}
function b() {
    return c();
}
function c() {
    for (const a of [
        1
    ]){
        same_name();
        return;
    }
}
a();
