var _class, _class2;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

let A = (_class2 = class A {
  foo() {}

}, (_applyDecoratedDescriptor(_class2.prototype, "foo", [dec], Object.getOwnPropertyDescriptor(_class2.prototype, "foo"), _class2.prototype)), _class2);
export { A as default };
let B = (_class = class B {
  foo() {}

}, (_applyDecoratedDescriptor(_class.prototype, "foo", [dec], Object.getOwnPropertyDescriptor(_class.prototype, "foo"), _class.prototype)), _class);
