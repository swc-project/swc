function foo(staticToString) {
    return staticToString instanceof StaticToString;
}
function bar(staticToNumber) {
    return staticToNumber instanceof StaticToNumber;
}
function baz(normal) {
    return normal instanceof NormalToString;
}
