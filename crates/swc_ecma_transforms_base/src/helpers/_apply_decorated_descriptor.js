function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};

  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator ? (decorator(target, property, desc) || desc) : desc;
  }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  var own = Object.getOwnPropertyDescriptor(target, property);
  if (own && (own.get || own.set)) {
    // Prevent overriding
    delete desc.writable;
    delete desc.initializer;
  }

  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}