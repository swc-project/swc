var _one, _ref, _undefined, _computed, _computed2, _ref2, _ref3, _baz, _ref4;

var foo = "foo";

var bar = () => {};

var four = 4;
_one = one();
_ref = 2 * four + seven;
_undefined = undefined;
_computed = computed();
_computed2 = computed();
_ref2 = "test" + one;
_ref3 = /regex/;
_baz = baz;
_ref4 = `template${expression}`;

var MyClass =
/*#__PURE__*/
function () {
  "use strict";

  function MyClass() {
    babelHelpers.classCallCheck(this, MyClass);
    this[null] = "null";
    this[_undefined] = "undefined";
    this[void 0] = "void 0";
    this[_ref3] = "regex";
    this[foo] = "foo";
    this[bar] = "bar";
    this[_baz] = "baz";
    this[`template`] = "template";
    this[_ref4] = "template-with-expression";
  }

  babelHelpers.createClass(MyClass, [{
    key: _ref2,
    value: function () {}
  }, {
    key: "whatever",
    get: function () {},
    set: function (value) {}
  }, {
    key: _computed,
    get: function () {}
  }, {
    key: _computed2,
    set: function (value) {}
  }], [{
    key: 10,
    value: function () {}
  }]);
  return MyClass;
}();

MyClass[_one] = "test";
MyClass[2 * 4 + 7] = "247";
MyClass[2 * four + 7] = "247";
MyClass[_ref] = "247";
