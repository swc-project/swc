function foo() {}
function baz() {
    return (function (...x) {
        return x[0];
    })(foo);
}
(function () {
    var thing = baz();
    if (thing !== (thing = baz())) console.log("FAIL");
    else console.log("PASS");
})();
