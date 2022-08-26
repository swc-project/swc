(function(o) {
    (function() {
        f();
    })();
    function f() {
        n(o);
    }
})("Hello World!");
function n(n) {
    if (!n.x) {
        console.log(n);
    }
}
