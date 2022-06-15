import copyProps from "./_copy_props"

export default function _toESM(mod, isNodeMode, target) {
  target = mod != null ? Object.create(Object.getPrototypeOf(mod)) : {};

  return copyProps(
    isNodeMode || !mod || !mod.__esModule
      ? Object.defineProperty(target, "default", { value: mod, enumerable: true })
      : target,
    mod,
  );
}
