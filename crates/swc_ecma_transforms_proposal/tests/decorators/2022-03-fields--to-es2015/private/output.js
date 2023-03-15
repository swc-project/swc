var _init_a, _init_b;
const dec = () => { };
var _a = /*#__PURE__*/new WeakMap();
var _b = /*#__PURE__*/new WeakMap();
class Foo {
  constructor() {
    classPrivateFieldInitSpec(this, _a, {
      writable: true,
      value: _init_a(this)
    });
    classPrivateFieldInitSpec(this, _b, {
      writable: true,
      value: _init_b(this, 123)
    });
  }
}
[_init_a, _init_b] = applyDecs2203R(Foo, [[dec, 0, "a", function () {
  return classPrivateFieldGet(this, _a);
}, function (value) {
  classPrivateFieldSet(this, _a, value);
}], [dec, 0, "b", function () {
  return classPrivateFieldGet(this, _b);
}, function (value) {
  classPrivateFieldSet(this, _b, value);
}]], []).e;
