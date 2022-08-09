function n() {
    o();
}
function o() {
    console.log(1);
}
function c() {
    function o() {
        console.log(2);
    }
    n();
    o();
}
c();
c();
