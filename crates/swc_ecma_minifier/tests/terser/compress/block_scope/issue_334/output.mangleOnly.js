(function(b) {
    (function() {
        c();
    })();
    function c() {
        a(b);
    }
})("Hello World!");
function a(a) {
    if (!a.x) {
        console.log(a);
    }
}
