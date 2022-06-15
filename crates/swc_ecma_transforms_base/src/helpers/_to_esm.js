function _toESM(mod, isNodeMode, target) {
  target = mod != null ? Object.create(Object.getPrototypeOf(mod)) : {};

  return _copyProps(
    isNodeMode || !mod || !mod.__esModule
      ? Object.defineProperty(target, "default", { value: mod, enumerable: true })
      : target,
    mod,
  );
}
