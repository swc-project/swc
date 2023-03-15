var _call_a, _initStatic;
const dec = () => { };
class Foo {
  static getA() {
    return classStaticPrivateFieldSpecGet(this, Foo, _a);
  }
}
function _get_a() {
  return _call_a(this);
}
var _a = {
  get: _get_a,
  set: void 0
};
(() => {
  [_call_a, _initStatic] = _applyDecs2203R(Foo, [[dec, 8, "a", function () {
    return this.value;
  }]], []).e;
  _initStatic(Foo);
})();
defineProperty(Foo, "value", 1);
