var _class, _class1;
let A = ((_class = class A {
    foo() {}
}) || _class, _applyDecoratedDescriptor(_class.prototype, "foo", [
    dec
], Object.getOwnPropertyDescriptor(_class.prototype, "foo"), _class.prototype), _class);
let B = ((_class1 = class B {
    foo() {}
}) || _class1, _applyDecoratedDescriptor(_class1.prototype, "foo", [
    dec
], Object.getOwnPropertyDescriptor(_class1.prototype, "foo"), _class1.prototype), _class1);
export { A as default };
