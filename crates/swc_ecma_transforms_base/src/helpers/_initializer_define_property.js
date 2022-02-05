function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  var currentVal = target[property];

  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer
        ? descriptor.initializer.call(context)
        : currentVal !== void 0
        ? currentVal
        : void 0,
  });
}
