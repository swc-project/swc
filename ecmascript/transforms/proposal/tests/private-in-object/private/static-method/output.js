let Foo = /*#__PURE__*/function () {
  "use strict";

  function Foo() {
    babelHelpers.classCallCheck(this, Foo);
  }

  babelHelpers.createClass(Foo, [{
    key: "test",
    value: function test(other) {
      return other === Foo;
    }
  }]);
  return Foo;
}();

function _foo() {}
