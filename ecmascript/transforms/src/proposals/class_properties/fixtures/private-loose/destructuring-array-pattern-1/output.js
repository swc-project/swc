var Foo = function Foo(props) {
  "use strict";

  babelHelpers.classCallCheck(this, Foo);
  Object.defineProperty(this, _client, {
    writable: true,
    value: void 0
  });
  babelHelpers.classPrivateFieldLooseBase(this, _client)[_client] = 1;
  [this.x = babelHelpers.classPrivateFieldLooseBase(this, _client)[_client], babelHelpers.classPrivateFieldLooseBase(this, _client)[_client], this.y = babelHelpers.classPrivateFieldLooseBase(this, _client)[_client]] = props;
};

var _client = babelHelpers.classPrivateFieldLooseKey("client");
