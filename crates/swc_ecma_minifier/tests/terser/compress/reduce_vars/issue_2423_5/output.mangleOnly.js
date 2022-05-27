function b() {
    c();
}
function c() {
    console.log(1);
}
function a() {
    function a() {
        console.log(2);
    }
    b();
}
a();
a();
