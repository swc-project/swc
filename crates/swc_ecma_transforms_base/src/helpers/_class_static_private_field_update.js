function _classStaticPrivateFieldUpdate(receiver, classConstructor, descriptor) {
  _classCheckPrivateStaticAccess(receiver, classConstructor);
  _classCheckPrivateStaticFieldDescriptor(descriptor, "update");
  return _classApplyDescriptorUpdate(receiver, descriptor);
}
