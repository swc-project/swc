//// [privateNamesInNestedClasses-1.ts]
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
var _foo = new WeakMap(), _bar = new WeakMap();
class A {
    method() {
        var _foo = new WeakMap();
        class B {
            bar(a) {
                _class_private_field_get(a, _foo);
            }
            baz(a) {
                _class_private_field_get(a, _foo);
            }
            quux(b) {
                _class_private_field_get(b, _foo);
            }
            constructor(){
                _class_private_field_init(this, _foo, {
                    writable: !0,
                    value: "B's #foo"
                });
            }
        }
        let a = new A();
        new B().bar(a), new B().baz(a);
        let b = new B();
        new B().quux(b);
    }
    constructor(){
        _class_private_field_init(this, _foo, {
            writable: !0,
            value: "A's #foo"
        }), _class_private_field_init(this, _bar, {
            writable: !0,
            value: "A's #bar"
        });
    }
}
new A().method();
