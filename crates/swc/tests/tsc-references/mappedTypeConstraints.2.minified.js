//// [mappedTypeConstraints.ts]
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
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
    obj.a, obj.b, obj.c;
}
function f4(obj) {
    obj.a, obj.c;
}
var modifier = function(targetProps) {
    targetProps.bar, _object_without_properties(targetProps, [
        "bar"
    ]).foo;
};
