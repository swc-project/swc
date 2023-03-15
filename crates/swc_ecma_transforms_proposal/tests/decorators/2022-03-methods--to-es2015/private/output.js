var _call_a, _initProto;
const dec = () => { };
var _a = /*#__PURE__*/new WeakMap();
class Foo {
  constructor(...args) {
    classPrivateFieldInitSpec(this, _a, {
      writable: true,
      value: _call_a
    });
    defineProperty(this, "value", 1);
    _initProto(this);
  }
  callA() {
    return classPrivateFieldGet(this, _a).call(this);
  }
}
[_call_a, _initProto] = _applyDecs2203R(Foo, [[dec, 2, "a", function () {
  return this.value;
}]], []).e;
