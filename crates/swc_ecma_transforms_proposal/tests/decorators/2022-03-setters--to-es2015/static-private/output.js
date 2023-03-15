var _call_a, _initStatic;
const dec = () => { };
class Foo {
  static setA(v) {
    classStaticPrivateFieldSpecSet(this, Foo, _a, v);
  }
}
function _set_a(v) {
  _call_a(this, v);
}
var _a = {
  get: void 0,
  set: _set_a
};
(() => {
  [_call_a, _initStatic] = _applyDecs2203R(Foo, [[dec, 9, "a", function (v) {
    return this.value = v;
  }]], []).e;
  _initStatic(Foo);
})();
defineProperty(Foo, "value", 1);
