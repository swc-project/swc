import * as swcHelpers from "@swc/helpers";
function foo(staticToString) {
    return swcHelpers._instanceof(staticToString, StaticToString);
}
function bar(staticToNumber) {
    return swcHelpers._instanceof(staticToNumber, StaticToNumber);
}
function baz(normal) {
    return swcHelpers._instanceof(normal, NormalToString);
}
