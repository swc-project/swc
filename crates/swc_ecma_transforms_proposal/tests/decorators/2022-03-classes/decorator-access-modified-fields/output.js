var _initClass, _init_m;
var value;
const classDec = Class => {
  value = new Class().p;
  return Class;
};
const memberDec = () => () => 42;
let _C;
class C {
  static {
    ({
      e: [_init_m],
      c: [_C, _initClass]
    } = babelHelpers.applyDecs2203R(this, [[memberDec, 0, "m"]], [classDec]));
  }
  m = _init_m(this);
  static {
    _initClass();
  }
}
