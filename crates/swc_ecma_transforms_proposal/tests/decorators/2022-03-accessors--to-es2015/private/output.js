var _init_a, _get_a, _set_a, _init_b, _get_b, _set_b, _initProto;
const dec = () => {};
var _A = /*#__PURE__*/new WeakMap();
var _a = /*#__PURE__*/new WeakMap();
var _B = /*#__PURE__*/new WeakMap();
var _b = /*#__PURE__*/new WeakMap();
class Foo {
  constructor() {
    babelHelpers.classPrivateFieldInitSpec(this, _b, {
      get: _get_b2,
      set: _set_b2
    });
    babelHelpers.classPrivateFieldInitSpec(this, _a, {
      get: _get_a2,
      set: _set_a2
    });
    babelHelpers.classPrivateFieldInitSpec(this, _A, {
      writable: true,
      value: (_initProto(this), _init_a(this))
    });
    babelHelpers.classPrivateFieldInitSpec(this, _B, {
      writable: true,
      value: _init_b(this, 123)
    });
  }
}
function _set_a2(v) {
  _set_a(this, v);
}
function _get_a2() {
  return _get_a(this);
}
function _set_b2(v) {
  _set_b(this, v);
}
function _get_b2() {
  return _get_b(this);
}
[_init_a, _get_a, _set_a, _init_b, _get_b, _set_b, _initProto] = babelHelpers.applyDecs2203R(Foo, [[dec, 1, "a", function () {
  return babelHelpers.classPrivateFieldGet(this, _A);
}, function (value) {
  babelHelpers.classPrivateFieldSet(this, _A, value);
}], [dec, 1, "b", function () {
  return babelHelpers.classPrivateFieldGet(this, _B);
}, function (value) {
  babelHelpers.classPrivateFieldSet(this, _B, value);
}]], []).e;
