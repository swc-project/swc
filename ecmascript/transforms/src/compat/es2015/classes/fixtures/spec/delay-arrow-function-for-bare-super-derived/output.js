var Foo =
/*#__PURE__*/
function (_Bar) {
  "use strict";

  babelHelpers.inherits(Foo, _Bar);

  function Foo() {
    var _this;

    babelHelpers.classCallCheck(this, Foo);
    return _this = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(Foo).call(this, () => {
      _this.test;
    }));
  }

  return Foo;
}(Bar);
