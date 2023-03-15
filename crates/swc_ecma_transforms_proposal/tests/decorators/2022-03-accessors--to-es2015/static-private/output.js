var _init_a, _get_a, _set_a, _init_b, _get_b, _set_b, _initStatic;
const dec = () => { };
var _a = /*#__PURE__*/new WeakMap();
var _b = /*#__PURE__*/new WeakMap();
class Foo {
  constructor() {
    classPrivateFieldInitSpec(this, _b, {
      get: _get_b2,
      set: _set_b2
    });
    classPrivateFieldInitSpec(this, _a, {
      get: _get_a2,
      set: _set_a2
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
(() => {
  [_init_a, _get_a, _set_a, _init_b, _get_b, _set_b, _initStatic] = applyDecs2203R(Foo, [[dec, 6, "a", function () {
    return classStaticPrivateFieldSpecGet(this, Foo, _A);
  }, function (value) {
    classStaticPrivateFieldSpecSet(this, Foo, _A, value);
  }], [dec, 6, "b", function () {
    return classStaticPrivateFieldSpecGet(this, Foo, _B);
  }, function (value) {
    classStaticPrivateFieldSpecSet(this, Foo, _B, value);
  }]], []).e;
  _initStatic(Foo);
})();
var _A = {
  writable: true,
  value: _init_a(Foo)
};
var _B = {
  writable: true,
  value: _init_b(Foo, 123)
};
