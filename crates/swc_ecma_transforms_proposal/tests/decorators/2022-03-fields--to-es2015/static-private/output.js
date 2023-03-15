var _init_a, _init_b;
const dec = () => { };
class Foo { }
[_init_a, _init_b] = _applyDecs2203R(Foo, [[dec, 5, "a", function () {
  return classStaticPrivateFieldSpecGet(this, Foo, _a);
}, function (value) {
  classStaticPrivateFieldSpecSet(this, Foo, _a, value);
}], [dec, 5, "b", function () {
  return classStaticPrivateFieldSpecGet(this, Foo, _b);
}, function (value) {
  classStaticPrivateFieldSpecSet(this, Foo, _b, value);
}]], []).e;
var _a = {
  writable: true,
  value: _init_a(Foo)
};
var _b = {
  writable: true,
  value: _init_b(Foo, 123)
};
