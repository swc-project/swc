var _computedKey, _initStatic;
const dec = () => {};
_computedKey = 'b';
class Foo {
  static a() {
    return this.value;
  }
  static [_computedKey]() {
    return this.value;
  }
}
(() => {
  [_initStatic] = babelHelpers.applyDecs2203R(Foo, [[dec, 7, "a"], [dec, 7, _computedKey]], []).e;
  _initStatic(Foo);
})();
babelHelpers.defineProperty(Foo, "value", 1);
