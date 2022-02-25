function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);
  _classCheckPrivateStaticFieldDescriptor(descriptor, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
