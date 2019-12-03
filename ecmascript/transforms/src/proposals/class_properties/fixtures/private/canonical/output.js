var Point =
/*#__PURE__*/
function () {
  "use strict";

  function Point(x = 0, y = 0) {
    babelHelpers.classCallCheck(this, Point);

    _x.set(this, {
      writable: true,
      value: void 0
    });

    _y.set(this, {
      writable: true,
      value: void 0
    });

    babelHelpers.classPrivateFieldSet(this, _x, +x);
    babelHelpers.classPrivateFieldSet(this, _y, +y);
  }

  babelHelpers.createClass(Point, [{
    key: "equals",
    value: function equals(p) {
      return babelHelpers.classPrivateFieldGet(this, _x) === babelHelpers.classPrivateFieldGet(p, _x) && babelHelpers.classPrivateFieldGet(this, _y) === babelHelpers.classPrivateFieldGet(p, _y);
    }
  }, {
    key: "toString",
    value: function toString() {
      return `Point<${babelHelpers.classPrivateFieldGet(this, _x)},${babelHelpers.classPrivateFieldGet(this, _y)}>`;
    }
  }, {
    key: "x",
    get: function () {
      return babelHelpers.classPrivateFieldGet(this, _x);
    },
    set: function (value) {
      babelHelpers.classPrivateFieldSet(this, _x, +value);
    }
  }, {
    key: "y",
    get: function () {
      return babelHelpers.classPrivateFieldGet(this, _y);
    },
    set: function (value) {
      babelHelpers.classPrivateFieldSet(this, _y, +value);
    }
  }]);
  return Point;
}();

var _x = new WeakMap();

var _y = new WeakMap();
