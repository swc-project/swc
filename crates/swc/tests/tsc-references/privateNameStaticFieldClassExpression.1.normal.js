//// [privateNameStaticFieldClassExpression.ts]
import { _ as _class_private_field_get } from "@swc/helpers/_/_class_private_field_get";
var __ = new WeakMap(), _class, __1 = new WeakMap(), Foo, _foo = new WeakMap(), _foo2 = new WeakMap();
class B {
    m() {
        console.log(_class_private_field_get(B, _foo).test);
        _class_private_field_get(B, _foo).test = 10;
        new (_class_private_field_get(B, _foo))().field;
    }
}
_foo.set(B, {
    writable: true,
    value: (_class = class {
        constructor(){
            this.field = 10;
            console.log("hello");
            new B.#foo2();
        }
    }, __.set(_class, {
        writable: true,
        value: B.test = 123
    }), _class)
});
_foo2.set(B, {
    writable: true,
    value: (Foo = class Foo {
    }, __1.set(Foo, {
        writable: true,
        value: Foo.otherClass = 123
    }), Foo)
});
