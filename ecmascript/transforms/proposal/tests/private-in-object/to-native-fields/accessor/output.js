var _FooBrandCheck = /*#__PURE__*/new WeakSet();

class Foo {
  constructor() {
    _FooBrandCheck.add(this);
  }

  get #foo() {}

  test(other) {
    return _FooBrandCheck.has(other);
  }

}
