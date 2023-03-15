var _computedKey, _initProto;
const dec = () => { };
_computedKey = 'b';
class Foo {
  constructor(...args) {
    defineProperty(this, "value", 1);
    _initProto(this);
  }
  get a() {
    return this.value;
  }
  get [_computedKey]() {
    return this.value;
  }
}
[_initProto] = applyDecs2203R(Foo, [[dec, 3, "a"], [dec, 3, _computedKey]], []).e;
