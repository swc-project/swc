//// [privateNameFieldClassExpression.ts]
import { _ as _class_private_field_init } from "@swc/helpers/_/_class_private_field_init";
import { _ as _class_private_field_set } from "@swc/helpers/_/_class_private_field_set";
var _foo = new WeakMap(), _foo2 = new WeakMap();
class B {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _foo2, {
            writable: true,
            value: void 0
        });
        var __ = new WeakMap(), _class, __1 = new WeakMap(), Foo;
        _class_private_field_set(this, _foo, (_class = class {
            constructor(){
                console.log("hello");
            }
        }, __.set(_class, {
            writable: true,
            value: this.test = 123
        }), _class));
        _class_private_field_set(this, _foo2, (Foo = class Foo {
        }, __1.set(Foo, {
            writable: true,
            value: Foo.otherClass = 123
        }), Foo));
    }
}
