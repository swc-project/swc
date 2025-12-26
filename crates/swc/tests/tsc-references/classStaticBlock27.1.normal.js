//// [classStaticBlock27.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap(), Foo;
// https://github.com/microsoft/TypeScript/issues/44872
void (Foo = function Foo() {
    "use strict";
    _class_call_check(this, Foo);
}, __.set(Foo, {
    writable: true,
    value: Foo.prop = 1
}), __2.set(Foo, {
    writable: true,
    value: function() {
        console.log(Foo.prop);
        Foo.prop++;
    }()
}), __3.set(Foo, {
    writable: true,
    value: function() {
        console.log(Foo.prop);
        Foo.prop++;
    }()
}), __4.set(Foo, {
    writable: true,
    value: function() {
        console.log(Foo.prop);
        Foo.prop++;
    }()
}), Foo);
