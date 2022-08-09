global.same_name = "PASS";
function n(n) {
    if (n) i(n);
}
function f() {
    console.log(same_name);
}
function i() {
    f();
}
n("FAIL");
