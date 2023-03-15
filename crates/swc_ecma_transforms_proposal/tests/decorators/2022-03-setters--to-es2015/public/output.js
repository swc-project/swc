var _computedKey, _initProto;
const dec = () => { };
_computedKey = 'b';
class Foo {
  constructor(...args) {
    defineProperty(this, "value", 1);
    _initProto(this);
  }
  set a(v) {
    return this.value = v;
  }
  set [_computedKey](v) {
    return this.value = v;
  }
}
[_initProto] = _applyDecs2203R(Foo, [[dec, 4, "a"], [dec, 4, _computedKey]], []).e;
