var _init_a, _init_b, _computedKey, _init_computedKey;
const dec = () => { };
_computedKey = 'c';
class Foo {
  constructor() {
    defineProperty(this, "a", _init_a(this));
    defineProperty(this, "b", _init_b(this, 123));
    defineProperty(this, _computedKey, _init_computedKey(this, 456));
  }
}
[_init_a, _init_b, _init_computedKey] = _applyDecs2203R(Foo, [[dec, 0, "a"], [dec, 0, "b"], [dec, 0, _computedKey]], []).e;
