/** @jsxRuntime classic */
var foo = function () {
  var _this = this;

  return function () {
    return /*#__PURE__*/React.createElement(_this, null);
  };
};

var bar = function () {
  var _this2 = this;

  return function () {
    return /*#__PURE__*/React.createElement(_this2.foo, null);
  };
};
