function classFactory() {
    var _foo, _Foo, _bar;
    return _foo = /*#__PURE__*/ new WeakMap(), _Foo = class Foo {
        instance() {
            return _class_private_field_get(this, _foo);
        }
        static() {
            return _class_static_private_field_spec_get(Foo, _Foo, _bar);
        }
        static instance(inst) {
            return _class_private_field_get(inst, _foo);
        }
        static static() {
            return _class_static_private_field_spec_get(Foo, _Foo, _bar);
        }
        constructor(){
            _class_private_field_init(this, _foo, {
                writable: true,
                value: "foo"
            });
        }
    }, _bar = {
        writable: true,
        value: "bar"
    }, _Foo;
}
