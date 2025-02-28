function o() {
    c();
}
function c() {
    console.log(1);
}
function n() {
    function n() {
        console.log(2);
    }
    o();
    n();
}
n();
n();
