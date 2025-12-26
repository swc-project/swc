//// [privateNameStaticFieldClassExpression.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
var _class, Foo, __ = new WeakMap(), __1 = new WeakMap(), _foo = new WeakMap(), _foo2 = new WeakMap();
class B {
    m() {
        console.log(_class_private_field_get(B, _foo).test), _class_private_field_get(B, _foo).test = 10, new (_class_private_field_get(B, _foo))().field;
    }
}
_foo.set(B, {
    writable: !0,
    value: (_class = class {
        constructor(){
            this.field = 10, console.log("hello"), new B.#foo2();
        }
    }, __.set(_class, {
        writable: !0,
        value: B.test = 123
    }), _class)
}), _foo2.set(B, {
    writable: !0,
    value: (Foo = class {
    }, __1.set(Foo, {
        writable: !0,
        value: Foo.otherClass = 123
    }), Foo)
});
