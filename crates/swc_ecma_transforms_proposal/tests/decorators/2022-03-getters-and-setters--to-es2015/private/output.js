var _call_a, _call_a2, _initProto;
const dec = () => { };
var _a = /*#__PURE__*/new WeakMap();
class Foo {
  constructor(...args) {
    classPrivateFieldInitSpec(this, _a, {
      get: _get_a,
      set: _set_a
    });
    defineProperty(this, "value", 1);
    _initProto(this);
  }
  getA() {
    return classPrivateFieldGet(this, _a);
  }
  setA(v) {
    classPrivateFieldSet(this, _a, v);
  }
}
function _get_a() {
  return _call_a(this);
}
function _set_a(v) {
  _call_a2(this, v);
}
[_call_a, _call_a2, _initProto] = applyDecs2203R(Foo, [[dec, 3, "a", function () {
  return this.value;
}], [dec, 4, "a", function (v) {
  this.value = v;
}]], []).e;
