function bar(k) {
    console.log(k);
}
function foo(x) {
    return bar(x);
}
function baz(a) {
    foo(a);
}
baz(42);
baz("PASS");
