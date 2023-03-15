var _call_a, _initStatic;
const dec = () => { };
class Foo {
  static callA() {
    return classStaticPrivateFieldSpecGet(this, Foo, _a).call(this);
  }
}
(() => {
  [_call_a, _initStatic] = applyDecs2203R(Foo, [[dec, 7, "a", function () {
    return this.value;
  }]], []).e;
  _initStatic(Foo);
})();
var _a = {
  writable: true,
  value: _call_a
};
defineProperty(Foo, "value", 1);
