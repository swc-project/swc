function main() {
    var thing = baz();
    if (thing !== (thing = baz())) console.log("PASS");
    else console.log("FAIL");
}
function baz() {
    function foo() {}
    function bar() {}
    return foo, bar;
}
main();
