function foo() {}
var gen = function*(s) {
    for(;;)yield foo;
}();
(function() {
    var thing = gen.next().value;
    if (thing !== (thing = gen.next().value)) console.log("FAIL");
    else console.log("PASS");
})();
