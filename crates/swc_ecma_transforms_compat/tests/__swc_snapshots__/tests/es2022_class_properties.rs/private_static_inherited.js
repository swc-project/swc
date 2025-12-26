var _foo = new WeakMap(), _foo1 = new WeakMap();
class Base {
    static getThis() {
        return _class_private_field_get(this, _foo);
    }
    static updateThis(val) {
        return _class_private_field_set(this, _foo, val);
    }
    static getClass() {
        return _class_private_field_get(Base, _foo);
    }
    static updateClass(val) {
        return _class_private_field_set(Base, _foo, val);
    }
}
_foo.set(Base, {
    writable: true,
    value: 1
});
class Sub1 extends Base {
    static update(val) {
        return _class_private_field_set(this, _foo1, val);
    }
}
_foo1.set(Sub1, {
    writable: true,
    value: 2
});
class Sub2 extends Base {
}
