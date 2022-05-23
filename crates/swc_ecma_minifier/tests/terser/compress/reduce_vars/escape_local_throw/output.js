function baz() {
    try {
        throw function () {};
    } catch (bar) {
        return bar;
    }
}
(function () {
    var thing = baz();
    if (thing !== (thing = baz())) console.log("PASS");
    else console.log("FAIL");
})();
