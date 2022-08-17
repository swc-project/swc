var n = 1;
c();
function c() {
    (function c() {
        n-- && c();
    })();
}
