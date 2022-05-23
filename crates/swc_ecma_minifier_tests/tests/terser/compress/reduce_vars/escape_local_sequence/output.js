function baz() {
    return function () {}, function () {};
}
(function () {
    var thing = baz();
    if (thing !== (thing = baz())) console.log("PASS");
    else console.log("FAIL");
})();
