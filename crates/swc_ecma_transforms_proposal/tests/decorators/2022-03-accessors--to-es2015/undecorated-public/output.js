const dec = () => { };
var _A = /*#__PURE__*/new WeakMap();
var _B = /*#__PURE__*/new WeakMap();
var _C = /*#__PURE__*/new WeakMap();
class Foo {
  constructor() {
    classPrivateFieldInitSpec(this, _A, {
      writable: true,
      value: void 0
    });
    classPrivateFieldInitSpec(this, _B, {
      writable: true,
      value: 123
    });
    classPrivateFieldInitSpec(this, _C, {
      writable: true,
      value: 456
    });
  }
  get a() {
    return classPrivateFieldGet(this, _A);
  }
  set a(v) {
    classPrivateFieldSet(this, _A, v);
  }
  get b() {
    return classPrivateFieldGet(this, _B);
  }
  set b(v) {
    classPrivateFieldSet(this, _B, v);
  }
  get ['c']() {
    return classPrivateFieldGet(this, _C);
  }
  set ['c'](v) {
    classPrivateFieldSet(this, _C, v);
  }
}
