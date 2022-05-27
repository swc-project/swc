global.same_name = "PASS";
function a(a) {
    if (a) c(a);
}
function b() {
    console.log(same_name);
}
function c() {
    b();
}
a("FAIL");
