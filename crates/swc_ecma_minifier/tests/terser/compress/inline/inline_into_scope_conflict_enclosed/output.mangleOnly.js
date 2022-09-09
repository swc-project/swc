global.same_name = "PASS";
function n(n) {
    if (n) a(n);
}
function o() {
    console.log(same_name);
}
function a() {
    o();
}
n("FAIL");
