var _init_a, _init_b, _computedKey, _init_computedKey;
const dec = () => { };
_computedKey = 'c';
class Foo { }
[_init_a, _init_b, _init_computedKey] = _applyDecs2203R(Foo, [[dec, 5, "a"], [dec, 5, "b"], [dec, 5, _computedKey]], []).e;
defineProperty(Foo, "a", _init_a(Foo));
defineProperty(Foo, "b", _init_b(Foo, 123));
defineProperty(Foo, _computedKey, _init_computedKey(Foo, 456));
