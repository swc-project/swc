var _call_a, _initProto;
const dec = () => {};
class Foo {
  static {
    [_call_a, _initProto] = babelHelpers.applyDecs2203R(this, [[dec, 2, "a", function () {
      return this.value;
    }]], []).e;
  }
  constructor(...args) {
    _initProto(this);
  }
  #a = _call_a;
  value = 1;
  callA() {
    return this.#a();
  }
}
