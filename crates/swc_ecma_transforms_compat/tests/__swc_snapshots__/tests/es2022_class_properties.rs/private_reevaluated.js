function classFactory() {
    var _foo = new WeakMap(), _bar = new WeakMap(), Foo;
    return Foo = class Foo {
        instance() {
            return _class_private_field_get(this, _foo);
        }
        static() {
            return _class_private_field_get(Foo, _bar);
        }
        static instance(inst) {
            return _class_private_field_get(inst, _foo);
        }
        static static() {
            return _class_private_field_get(Foo, _bar);
        }
        constructor(){
            _class_private_field_init(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }, _bar.set(Foo, {
        writable: true,
        value: "bar"
    }), Foo;
}
