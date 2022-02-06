function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;

  var own =
    Object.getOwnPropertyDescriptor(target, property) ||
    Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(target),
      property
    );

  // prevent overriding obj accessors
  if (own && (own.get || own.set)) return;

  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer
      ? descriptor.initializer.call(context)
      : own && own.value !== void 0
      ? own.value
      : void 0,
  });
}
