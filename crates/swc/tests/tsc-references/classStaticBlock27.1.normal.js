//// [classStaticBlock27.ts]
// https://github.com/microsoft/TypeScript/issues/44872
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var _Foo;
void (_Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
}, function() {
    _Foo.prop = 1;
}(), function() {
    console.log(_Foo.prop);
    _Foo.prop++;
}(), function() {
    console.log(_Foo.prop);
    _Foo.prop++;
}(), function() {
    console.log(_Foo.prop);
    _Foo.prop++;
}(), _Foo);
