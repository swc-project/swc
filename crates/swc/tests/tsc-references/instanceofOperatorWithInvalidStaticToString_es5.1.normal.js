import _instanceof from "@swc/helpers/src/_instanceof.mjs";
function foo(staticToString) {
    return _instanceof(staticToString, StaticToString);
}
function bar(staticToNumber) {
    return _instanceof(staticToNumber, StaticToNumber);
}
function baz(normal) {
    return _instanceof(normal, NormalToString);
}
