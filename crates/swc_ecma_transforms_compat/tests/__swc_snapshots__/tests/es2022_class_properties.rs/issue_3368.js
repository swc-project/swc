var _a = new WeakMap(), _b = new WeakMap(), _bar = new WeakSet();
class A {
    foo() {
        return class B {
            bar() {
                console.log(this.#a, this.#b, this.#bar);
            }
        };
    }
    constructor(){
        _bar.add(this);
        _class_private_field_init(this, _a, {
            writable: true,
            value: 'fff'
        });
    }
}
function bar() {}
_b.set(A, {
    writable: true,
    value: 123
});
