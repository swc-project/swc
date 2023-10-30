var _fieldFunc = /*#__PURE__*/ new WeakMap();
class A {
    test() {
        _class_private_field_get(this, _fieldFunc)?.call(this);
    }
    constructor(){
        _class_private_field_init(this, _fieldFunc, {
            writable: true,
            value: void 0
        });
        _define_property(this, "x", 1);
    }
}
