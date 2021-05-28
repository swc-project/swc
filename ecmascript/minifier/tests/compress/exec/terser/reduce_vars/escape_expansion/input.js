function main() {
    var thing = baz();
    if (thing !== (thing = baz())) console.log("FAIL");
    else console.log("PASS");
}
function foo() {}
function bar(...x) {
    return x[0];
}
function baz() {
    return bar(...[foo]);
}
main();
