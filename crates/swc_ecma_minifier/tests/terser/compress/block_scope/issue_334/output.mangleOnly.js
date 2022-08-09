(function(f) {
    (function() {
        i();
    })();
    function i() {
        n(f);
    }
})("Hello World!");
function n(n) {
    if (!n.x) {
        console.log(n);
    }
}
