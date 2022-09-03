//// [classStaticBlock27.ts]
var _Foo, __, __1, __2;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(_Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
}).prop = 1, __ = {
    writable: !0,
    value: void (console.log(_Foo.prop), _Foo.prop++)
}, __1 = {
    writable: !0,
    value: void (console.log(_Foo.prop), _Foo.prop++)
}, __2 = {
    writable: !0,
    value: void (console.log(_Foo.prop), _Foo.prop++)
};
