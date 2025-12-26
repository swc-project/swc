var _a = /*#__PURE__*/ new WeakMap(), _bar = /*#__PURE__*/ new WeakSet();
class A {
    foo() {
        return class B {
            bar() {
                console.log(_class_private_field_get(this, _a), _class_static_private_field_spec_get(this, A, _b), _class_private_method_get(this, _bar, bar));
            }
        };
    }
    constructor(){
        _class_private_method_init(this, _bar);
        _class_private_field_init(this, _a, {
            writable: true,
            value: 'fff'
        });
    }
}
var _b = {
    writable: true,
    value: 123
};
function bar() {}
