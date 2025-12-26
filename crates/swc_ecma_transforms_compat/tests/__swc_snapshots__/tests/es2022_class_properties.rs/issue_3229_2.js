var _b = /*#__PURE__*/ new WeakMap();
class A {
    foo() {
        var _A;
        _class_private_field_set(_A = A, _b, _class_private_field_get(_A, _b) + 123);
        class B {
            foo() {}
        }
    }
    constructor(){
        _class_private_field_init(this, _b, {
            writable: true,
            value: void 0
        });
    }
}
