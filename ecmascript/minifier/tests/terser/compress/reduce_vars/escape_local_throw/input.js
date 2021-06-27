function main() {
    var thing = baz();
    if (thing !== (thing = baz())) console.log("PASS");
    else console.log("FAIL");
}
function baz() {
    function foo() {}
    try {
        throw foo;
    } catch (bar) {
        return bar;
    }
}
main();
