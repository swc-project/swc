var _call_a, _initProto;
const dec = () => { };
var _a = /*#__PURE__*/new WeakMap();
class Foo {
  constructor(...args) {
    classPrivateFieldInitSpec(this, _a, {
      get: _get_a,
      set: void 0
    });
    defineProperty(this, "value", 1);
    _initProto(this);
  }
  getA() {
    return classPrivateFieldGet(this, _a);
  }
}
function _get_a() {
  return _call_a(this);
}
[_call_a, _initProto] = _applyDecs2203R(Foo, [[dec, 3, "a", function () {
  return this.value;
}]], []).e;
