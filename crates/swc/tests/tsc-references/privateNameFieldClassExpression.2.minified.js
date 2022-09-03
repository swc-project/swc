//// [privateNameFieldClassExpression.ts]
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _class, _Foo, _foo = new WeakMap(), _foo2 = new WeakMap();
class B {
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: ((_class = class {
                constructor(){
                    console.log("hello");
                }
            }).test = 123, _class)
        }), _class_private_field_init(this, _foo2, {
            writable: !0,
            value: ((_Foo = class {
            }).otherClass = 123, _Foo)
        });
    }
}
