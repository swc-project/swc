function main() {
    var thing = baz();
    if (thing !== (thing = baz())) console.log("FAIL");
    else console.log("PASS");
}
function baz() {
    try {
        throw foo;
    } catch (bar) {
        return bar;
    }
}
function foo() {}
main();
