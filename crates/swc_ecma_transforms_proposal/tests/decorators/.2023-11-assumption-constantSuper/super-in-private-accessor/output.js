var _Bar;
let _initProto, _call_x;
const dec = () => {};
class Foo extends (_Bar = Bar) {
  static {
    [_call_x, _initProto] = babelHelpers.applyDecs2311(this, [], [[dec, 3, "x", function () {
      return Bar.prototype.foo.call(this);
    }]], 0, _ => #x in _, _Bar).e;
  }
  constructor(...args) {
    super(...args);
    _initProto(this);
  }
  get #x() {
    return _call_x(this);
  }
}
