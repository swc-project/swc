function main() {
    var thing = gen.next().value;
    if (thing !== (thing = gen.next().value)) console.log("FAIL");
    else console.log("PASS");
}
function foo() {}
function* baz(s) {
    for (;;) yield foo;
}
var gen = baz();
main();
