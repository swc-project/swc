const dec = () => { };
class Foo {
  static get a() {
    return classStaticPrivateFieldSpecGet(this, Foo, _A);
  }
  static set a(v) {
    classStaticPrivateFieldSpecSet(this, Foo, _A, v);
  }
  static get b() {
    return classStaticPrivateFieldSpecGet(this, Foo, _B);
  }
  static set b(v) {
    classStaticPrivateFieldSpecSet(this, Foo, _B, v);
  }
  static get ['c']() {
    return classStaticPrivateFieldSpecGet(this, Foo, _C);
  }
  static set ['c'](v) {
    classStaticPrivateFieldSpecSet(this, Foo, _C, v);
  }
}
var _A = {
  writable: true,
  value: void 0
};
var _B = {
  writable: true,
  value: 123
};
var _C = {
  writable: true,
  value: 456
};
