function a() {
    b();
}
function b() {
    console.log(1);
}
function c() {
    function b() {
        console.log(2);
    }
    a();
}
c();
c();
