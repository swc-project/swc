class Base {
    static getThis() {
        return _class_static_private_field_spec_get(this, Base, _foo);
    }
    static updateThis(val) {
        return _class_static_private_field_spec_set(this, Base, _foo, val);
    }
    static getClass() {
        return _class_static_private_field_spec_get(Base, Base, _foo);
    }
    static updateClass(val) {
        return _class_static_private_field_spec_set(Base, Base, _foo, val);
    }
}
var _foo = {
    writable: true,
    value: 1
};
class Sub1 extends Base {
    static update(val) {
        return _class_static_private_field_spec_set(this, Sub1, _foo1, val);
    }
}
var _foo1 = {
    writable: true,
    value: 2
};
class Sub2 extends Base {
}
