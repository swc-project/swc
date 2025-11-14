function baz() {
    return bar;
}
function bar() {}
(function() {
    var thing = baz();
    if (thing !== (thing = baz())) console.log("FAIL");
    else console.log("PASS");
})();
