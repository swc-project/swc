var _init_a, _init_b, _computedKey, _init_computedKey, _initStatic;
const dec = () => { };
_computedKey = 'c';
class Foo {
  static get a() {
    return classStaticPrivateFieldSpecGet(this, Foo, _A);
  }
  static set a(v) {
    classStaticPrivateFieldSpecSet(this, Foo, _A, v);
  }
  static get b() {
    return classStaticPrivateFieldSpecGet(this, Foo, _B);
  }
  static set b(v) {
    classStaticPrivateFieldSpecSet(this, Foo, _B, v);
  }
  static get [_computedKey]() {
    return classStaticPrivateFieldSpecGet(this, Foo, _C);
  }
  static set [_computedKey](v) {
    classStaticPrivateFieldSpecSet(this, Foo, _C, v);
  }
}
(() => {
  [_init_a, _init_b, _init_computedKey, _initStatic] = _applyDecs2203R(Foo, [[dec, 6, "a"], [dec, 6, "b"], [dec, 6, _computedKey]], []).e;
  _initStatic(Foo);
})();
var _A = {
  writable: true,
  value: _init_a(Foo)
};
var _B = {
  writable: true,
  value: _init_b(Foo, 123)
};
var _C = {
  writable: true,
  value: _init_computedKey(Foo, 456)
};
