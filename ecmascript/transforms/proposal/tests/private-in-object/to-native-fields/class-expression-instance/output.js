function fn() {
  var _privBrandCheck;

  return new (_privBrandCheck = /*#__PURE__*/new WeakSet(), class {
    #priv = void _privBrandCheck.add(this);

    method(obj) {
      return _privBrandCheck.has(obj);
    }

  })();
}
