var _foo = /*#__PURE__*/new WeakMap();

var _bar = /*#__PURE__*/new WeakMap();

let Foo = /*#__PURE__*/function () {
  "use strict";

  function Foo() {
    babelHelpers.classCallCheck(this, Foo);

    _foo.set(this, {
      writable: true,
      value: 1
    });

    _bar.set(this, {
      writable: true,
      value: 1
    });
  }

  babelHelpers.createClass(Foo, [{
    key: "test",
    value: function test() {
      var _bar2 = /*#__PURE__*/new WeakMap();

      let Nested = /*#__PURE__*/function () {
        function Nested() {
          babelHelpers.classCallCheck(this, Nested);

          _bar2.set(this, {
            writable: true,
            value: 2
          });
        }

        babelHelpers.createClass(Nested, [{
          key: "test",
          value: function test() {
            _foo.has(this);

            _bar2.has(this);
          }
        }]);
        return Nested;
      }();

      _foo.has(this);

      _bar.has(this);
    }
  }]);
  return Foo;
}();
