function main() {
    var thing = baz();
    if (thing !== (thing = baz())) console.log("PASS");
    else console.log("FAIL");
}
function baz(s) {
    function foo() {}
    function bar() {}
    return s ? foo : bar;
}
main();
