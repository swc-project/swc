var _name = /*#__PURE__*/ new WeakMap();
class Animal {
    noise() {
        return _class_private_field_get(this, _name);
    }
    constructor(name){
        _class_private_field_init(this, _name, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _name, name);
    }
}
