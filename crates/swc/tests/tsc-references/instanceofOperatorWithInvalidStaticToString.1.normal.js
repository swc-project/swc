//// [instanceofOperatorWithInvalidStaticToString.ts]
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
function foo(staticToString) {
    return _instanceof(staticToString, StaticToString);
}
function bar(staticToNumber) {
    return _instanceof(staticToNumber, StaticToNumber);
}
function baz(normal) {
    return _instanceof(normal, NormalToString);
}
