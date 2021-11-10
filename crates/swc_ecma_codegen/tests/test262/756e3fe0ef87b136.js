function a() {
    b();
    c();
    return d();
}
function e() {
    b();
    c();
    throw new f();
}
