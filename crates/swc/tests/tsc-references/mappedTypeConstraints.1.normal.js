//// [mappedTypeConstraints.ts]
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
function f0(obj) {
    obj.b;
}
function f1(obj) {
    obj.b;
}
function f2(obj) {
    obj.b;
}
function f3(obj) {
    obj.a;
    obj.b;
    obj.c;
}
function f4(obj) {
    obj.a;
    obj.c;
}
var modifier = function modifier(targetProps) {
    var bar = targetProps.bar, rest = _object_without_properties(targetProps, [
        "bar"
    ]);
    rest.foo;
};
