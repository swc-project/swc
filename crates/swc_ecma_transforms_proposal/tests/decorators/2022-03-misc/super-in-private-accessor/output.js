var _call_x, _initProto;
const dec = () => { };
class Foo extends Bar {
  static {
    [_call_x, _initProto] = applyDecs2203R(this, [[dec, 3, "x", function () {
      return get(getPrototypeOf(Foo), "foo", this).call(this);
    }]], []).e;
  }
  constructor(...args) {
    super(...args);
    _initProto(this);
  }
  get #x() {
    return _call_x(this);
  }
}
