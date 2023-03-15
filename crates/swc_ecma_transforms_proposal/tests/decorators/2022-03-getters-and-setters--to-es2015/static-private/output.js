var _call_a, _call_a2, _initStatic;
const dec = () => { };
class Foo {
  static getA() {
    return classStaticPrivateFieldSpecGet(this, Foo, _a);
  }
  static setA(v) {
    classStaticPrivateFieldSpecSet(this, Foo, _a, v);
  }
}
function _get_a() {
  return _call_a(this);
}
function _set_a(v) {
  _call_a2(this, v);
}
var _a = {
  get: _get_a,
  set: _set_a
};
(() => {
  [_call_a, _call_a2, _initStatic] = applyDecs2203R(Foo, [[dec, 8, "a", function () {
    return this.value;
  }], [dec, 9, "a", function (v) {
    this.value = v;
  }]], []).e;
  _initStatic(Foo);
})();
defineProperty(Foo, "value", 1);
