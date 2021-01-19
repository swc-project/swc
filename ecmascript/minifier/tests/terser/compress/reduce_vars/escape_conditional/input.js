function main() {
    var thing = baz();
    if (thing !== (thing = baz())) console.log("FAIL");
    else console.log("PASS");
}
function baz(s) {
    return s ? foo : bar;
}
function foo() {}
function bar() {}
main();
